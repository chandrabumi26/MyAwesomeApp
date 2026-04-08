import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle preflight request untuk CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageBase64, captureTime } = await req.json()

    // Ambil Environment Variables yang otomatis ada di Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Decode Base64 ke Binary untuk diupload ke Storage
    const byteCharacters = atob(imageBase64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)

    // 2. Upload Foto ke Storage Bucket 'photos'
    const fileName = `attendance/${Date.now()}.jpg`
    const { data: storageData, error: storageError } = await supabase.storage
      .from('photos')
      .upload(fileName, byteArray, { contentType: 'image/jpeg' })

    if (storageError) throw storageError

    // 3. Ambil URL Public-nya
    const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(fileName)

    // 4. Insert data ke Tabel 'attendance_logs'
    const { data, error: dbError } = await supabase
      .from('attendance_logs')
      .insert([{ photo_url: publicUrl, capture_time: captureTime }])
      .select()

    if (dbError) throw dbError

    return new Response(JSON.stringify({ message: "Data saved!", data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})
