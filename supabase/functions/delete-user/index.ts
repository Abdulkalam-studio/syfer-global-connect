import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header provided')
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with user's token to verify they're admin
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Get current user
    const { data: { user: currentUser }, error: userError } = await supabaseUser.auth.getUser()
    if (userError || !currentUser) {
      console.error('Failed to get current user:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Current user:', currentUser.id)

    // Check if current user is admin using RPC function
    const { data: isAdmin, error: roleError } = await supabaseUser.rpc('has_role', {
      _user_id: currentUser.id,
      _role: 'admin'
    })

    if (roleError || !isAdmin) {
      console.error('User is not admin:', roleError)
      return new Response(
        JSON.stringify({ error: 'Only admins can delete users' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the user ID to delete from request body
    const { userId } = await req.json()
    if (!userId) {
      console.error('No userId provided')
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Deleting user:', userId)

    // Prevent admin from deleting themselves
    if (userId === currentUser.id) {
      return new Response(
        JSON.stringify({ error: 'You cannot delete your own account' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create admin client with service role key for deletion
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Delete related data first (messages, rfqs, profile, user_roles, tokens)
    // Note: Some tables may have ON DELETE CASCADE, but we'll be explicit
    
    // 1. Delete messages where user is sender
    const { error: messagesError } = await supabaseAdmin
      .from('messages')
      .delete()
      .eq('sender_id', userId)
    
    if (messagesError) {
      console.error('Error deleting messages:', messagesError)
    }

    // 2. Get user's RFQs to delete associated messages
    const { data: userRfqs } = await supabaseAdmin
      .from('rfqs')
      .select('id')
      .eq('user_id', userId)

    if (userRfqs && userRfqs.length > 0) {
      const rfqIds = userRfqs.map(r => r.id)
      // Delete messages for these RFQs
      const { error: rfqMessagesError } = await supabaseAdmin
        .from('messages')
        .delete()
        .in('rfq_id', rfqIds)
      
      if (rfqMessagesError) {
        console.error('Error deleting RFQ messages:', rfqMessagesError)
      }
    }

    // 3. Delete RFQs
    const { error: rfqsError } = await supabaseAdmin
      .from('rfqs')
      .delete()
      .eq('user_id', userId)
    
    if (rfqsError) {
      console.error('Error deleting RFQs:', rfqsError)
    }

    // 4. Delete profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('user_id', userId)
    
    if (profileError) {
      console.error('Error deleting profile:', profileError)
    }

    // 5. Delete user roles
    const { error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
    
    if (rolesError) {
      console.error('Error deleting user roles:', rolesError)
    }

    // 6. Delete password reset tokens
    const { error: resetTokensError } = await supabaseAdmin
      .from('password_reset_tokens')
      .delete()
      .eq('user_id', userId)
    
    if (resetTokensError) {
      console.error('Error deleting password reset tokens:', resetTokensError)
    }

    // 7. Delete email verification tokens
    const { error: verifyTokensError } = await supabaseAdmin
      .from('email_verification_tokens')
      .delete()
      .eq('user_id', userId)
    
    if (verifyTokensError) {
      console.error('Error deleting email verification tokens:', verifyTokensError)
    }

    // 8. Delete admin session logs if any
    const { error: sessionLogsError } = await supabaseAdmin
      .from('admin_session_logs')
      .delete()
      .eq('user_id', userId)
    
    if (sessionLogsError) {
      console.error('Error deleting session logs:', sessionLogsError)
    }

    // Finally, delete the user from auth.users
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('Error deleting user from auth:', deleteError)
      return new Response(
        JSON.stringify({ error: 'Failed to delete user: ' + deleteError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('User deleted successfully:', userId)

    return new Response(
      JSON.stringify({ success: true, message: 'User and all associated data deleted successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
