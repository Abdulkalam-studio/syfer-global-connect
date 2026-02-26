-- Create enums for roles, status, and categories
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.rfq_status AS ENUM ('Pending', 'In Discussion', 'Closed');
CREATE TYPE public.product_category AS ENUM (
  'Agricultural Products',
  'Spices & Herbs',
  'Textiles & Fabrics',
  'Handicrafts & Decor',
  'Food Products',
  'Leather Goods',
  'Gems & Jewelry',
  'Chemicals & Pharmaceuticals',
  'Machinery & Equipment',
  'Other'
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  country TEXT NOT NULL DEFAULT '',
  state TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  user_code TEXT NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category product_category NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  video_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  moq INTEGER NOT NULL DEFAULT 5000,
  export_highlight TEXT NOT NULL DEFAULT 'FREE EXPORTING CHARGES',
  payment_terms TEXT[] NOT NULL DEFAULT ARRAY['60% advance on confirmation', '40% before issuance of AWB'],
  customization_note TEXT NOT NULL DEFAULT 'Customization in design, size, and branding is available as per your requirement.',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create RFQs table
CREATE TABLE public.rfqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL,
  target_price TEXT,
  country TEXT NOT NULL,
  message TEXT NOT NULL,
  status rfq_status NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for RFQ chat
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID REFERENCES public.rfqs(id) ON DELETE CASCADE NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('admin', 'user')),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contacts table
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin session logs
CREATE TABLE public.admin_session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  login_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  logout_at TIMESTAMP WITH TIME ZONE
);

-- Create password reset tokens
CREATE TABLE public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email verification tokens
CREATE TABLE public.email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_session_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to generate user code
CREATE OR REPLACE FUNCTION public.generate_user_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 100)::TEXT, 2, '0');
END;
$$;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_code TEXT;
BEGIN
  new_user_code := public.generate_user_code();
  
  INSERT INTO public.profiles (user_id, username, email, phone, user_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    new_user_code
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rfqs_updated_at
  BEFORE UPDATE ON public.rfqs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for RFQs
CREATE POLICY "Users can view own RFQs"
  ON public.rfqs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own RFQs"
  ON public.rfqs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own RFQs"
  ON public.rfqs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all RFQs"
  ON public.rfqs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all RFQs"
  ON public.rfqs FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for messages
CREATE POLICY "Users can view messages for own RFQs"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.rfqs
      WHERE rfqs.id = messages.rfq_id
      AND rfqs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages for own RFQs"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.rfqs
      WHERE rfqs.id = rfq_id
      AND rfqs.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all messages"
  ON public.messages FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for contacts (anyone can submit, admin can view)
CREATE POLICY "Anyone can submit contact"
  ON public.contacts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view contacts"
  ON public.contacts FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for admin session logs
CREATE POLICY "Admins can manage session logs"
  ON public.admin_session_logs FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for password reset tokens
CREATE POLICY "Anyone can create reset tokens"
  ON public.password_reset_tokens FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view reset tokens"
  ON public.password_reset_tokens FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update reset tokens"
  ON public.password_reset_tokens FOR UPDATE
  USING (true);

-- RLS Policies for email verification tokens
CREATE POLICY "Anyone can create verification tokens"
  ON public.email_verification_tokens FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view verification tokens"
  ON public.email_verification_tokens FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update verification tokens"
  ON public.email_verification_tokens FOR UPDATE
  USING (true);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product images
CREATE POLICY "Product images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;