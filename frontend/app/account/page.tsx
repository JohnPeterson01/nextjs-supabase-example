import AccountForm from './account-form'
import { createClient } from '@/utils/supabase/server'
export default async function Account() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // if we don't confirm the email of the user we will get `null` back
  // which will then cause other issues in the account form
  return <AccountForm user={user} />
}