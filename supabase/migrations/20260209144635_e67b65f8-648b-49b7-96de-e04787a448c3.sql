
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_user_code TEXT;
  assigned_role app_role;
BEGIN
  new_user_code := public.generate_user_code();
  
  -- Determine role: admin for specific email, user for everyone else
  IF NEW.email = 'syfer071@gmail.com' THEN
    assigned_role := 'admin';
  ELSE
    assigned_role := 'user';
  END IF;
  
  INSERT INTO public.profiles (user_id, username, email, phone, company_name, country, state, city, user_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NEW.raw_user_meta_data->>'company_name',
    COALESCE(NEW.raw_user_meta_data->>'country', ''),
    COALESCE(NEW.raw_user_meta_data->>'state', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    new_user_code
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role);
  
  RETURN NEW;
END;
$function$;
