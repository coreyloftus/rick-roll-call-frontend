export type TwilioStatusResponse = {
    auth_token: string
    date_created: string
    date_updated: string
    friendly_name: string
    owner_account_sid: string
    sid: string
    status: string
    subresource_uris: {
        available_phone_numbers: string
        calls: string
        conferences: string
        incoming_phone_numbers: string
        notifications: string
        outgoing_caller_ids: string
        recordings: string
        transcriptions: string
        addresses: string
        signing_keys: string
        connect_apps: string
        sip: string
        authorized_connect_apps: string
        usage: string
        keys: string
        applications: string
        short_codes: string
        queues: string
        messages: string
        balance: string
    }
    type: string
    uri: string
}

export type TwilioCallState = {
    success: boolean
    message: string
    audio_file_url: string | null
    call_sid: string | null
    status: 'queued' | 'in_progress' | 'completed' | 'failed' | null
    error: string | null
}

export type TwilioCallResponse =
    | {
          success: true
          message: string
          audio_file_url: string | null
          call_sid: string
      }
    | {
          success: false
          error: string
          message: string
          audio_file_url: null
          call_sid: null
      }

export type TwilioCallStatusResponse =
    | {
          success: true
          call_sid: string
          status: string
          direction: string
          from_: string
          to: string
          duration: string
          price: string
          price_unit: string
          date_created: string
          date_updated: string
          start_time: string
          end_time: string
          message: string
      }
    | {
          success: false
          error: string
          message: string
      }
