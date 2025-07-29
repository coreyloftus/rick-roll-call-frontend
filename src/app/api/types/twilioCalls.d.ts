export interface TwilioStatusResponse {
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
