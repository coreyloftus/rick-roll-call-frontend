import { twilioCall, getTwilioStatus, getTwilioCallStatus } from '../twilioCalls'
import { TwilioCallResponse, TwilioStatusResponse, TwilioCallStatusResponse } from '../types/twilioCalls'

// Mock Response types
interface MockResponse {
    ok: boolean
    status?: number
    statusText?: string
    json?: jest.Mock
}

global.fetch = jest.fn()

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

beforeEach(() => {
  mockFetch.mockClear()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('twilioCalls API functions', () => {
  describe('twilioCall', () => {
    const mockCallParams = {
      to_phone_number: '+1234567890',
      audio_file_url: 'https://example.com/audio.wav'
    }

    const mockSuccessResponse: TwilioCallResponse = {
      success: true,
      message: 'Call initiated successfully',
      audio_file_url: 'https://example.com/audio.wav',
      call_sid: 'CA1234567890abcdef1234567890abcdef'
    }

    const mockFailureResponse: TwilioCallResponse = {
      success: false,
      error: 'Invalid phone number',
      message: 'Failed to initiate call',
      audio_file_url: null,
      call_sid: null
    }

    it('should successfully initiate a call', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockSuccessResponse)
      }
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

      const result = await twilioCall(mockCallParams)
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-backend.com/twilio/call',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(mockCallParams)
        }
      )
      
      expect(result).toEqual(mockSuccessResponse)
      expect(result.success).toBe(true)
      expect(result.call_sid).toBe('CA1234567890abcdef1234567890abcdef')
    })

    it('should handle call initiation failure', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockFailureResponse)
      }
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

      const result = await twilioCall(mockCallParams)
      
      expect(result).toEqual(mockFailureResponse)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Invalid phone number')
        expect(result.call_sid).toBeNull()
      }
    })

    it('should handle different phone number formats', async () => {
      const internationalParams = {
        to_phone_number: '+44123456789',
        audio_file_url: 'https://example.com/audio.wav'
      }

      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockSuccessResponse)
      }
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

      await twilioCall(internationalParams)
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-backend.com/twilio/call',
        expect.objectContaining({
          body: JSON.stringify(internationalParams)
        })
      )
    })

    it('should handle different audio file URLs', async () => {
      const mp3Params = {
        to_phone_number: '+1234567890',
        audio_file_url: 'https://storage.googleapis.com/bucket/audio.mp3'
      }

      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          ...mockSuccessResponse,
          audio_file_url: mp3Params.audio_file_url
        })
      }
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

      const result = await twilioCall(mp3Params)
      
      expect(result.audio_file_url).toBe(mp3Params.audio_file_url)
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(twilioCall(mockCallParams)).rejects.toThrow('Network error')
    })

    it('should handle HTTP errors', async () => {
      const mockResponse: MockResponse = {
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValueOnce({
          error: 'Internal server error'
        })
      }
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

      const result = await twilioCall(mockCallParams)
      
      if (!result.success) {
        expect(result.error).toBe('Internal server error')
      }
    })

    it('should handle malformed JSON response', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON'))
      }
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

      await expect(twilioCall(mockCallParams)).rejects.toThrow('Invalid JSON')
    })
  })

  describe('getTwilioStatus', () => {
    const mockActiveStatusResponse: TwilioStatusResponse = {
      auth_token: 'token123',
      date_created: '2024-01-01T00:00:00Z',
      date_updated: '2024-01-01T00:00:00Z',
      friendly_name: 'Test Account',
      owner_account_sid: 'AC123',
      sid: 'AC123',
      status: 'active',
      subresource_uris: {
        available_phone_numbers: '/Accounts/AC123/AvailablePhoneNumbers',
        calls: '/Accounts/AC123/Calls',
        conferences: '/Accounts/AC123/Conferences',
        incoming_phone_numbers: '/Accounts/AC123/IncomingPhoneNumbers',
        notifications: '/Accounts/AC123/Notifications',
        outgoing_caller_ids: '/Accounts/AC123/OutgoingCallerIds',
        recordings: '/Accounts/AC123/Recordings',
        transcriptions: '/Accounts/AC123/Transcriptions',
        addresses: '/Accounts/AC123/Addresses',
        signing_keys: '/Accounts/AC123/SigningKeys',
        connect_apps: '/Accounts/AC123/ConnectApps',
        sip: '/Accounts/AC123/SIP',
        authorized_connect_apps: '/Accounts/AC123/AuthorizedConnectApps',
        usage: '/Accounts/AC123/Usage',
        keys: '/Accounts/AC123/Keys',
        applications: '/Accounts/AC123/Applications',
        short_codes: '/Accounts/AC123/SMS/ShortCodes',
        queues: '/Accounts/AC123/Queues',
        messages: '/Accounts/AC123/Messages',
        balance: '/Accounts/AC123/Balance'
      },
      type: 'Full',
      uri: '/Accounts/AC123'
    }

    it('should return true when Twilio status is active', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockActiveStatusResponse)
      }
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

      const result = await getTwilioStatus()
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-backend.com/twilio/status',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
      
      expect(result).toBe(true)
    })

    it('should return false when Twilio status is not active', async () => {
      const inactiveResponse = {
        ...mockActiveStatusResponse,
        status: 'suspended'
      }

      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValueOnce(inactiveResponse)
      }
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

      const result = await getTwilioStatus()
      expect(result).toBe(false)
    })

    it('should handle different status values', async () => {
      const testStatuses = ['inactive', 'closed', 'pending']
      
      for (const status of testStatuses) {
        const mockResponse: MockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValueOnce({
            ...mockActiveStatusResponse,
            status
          })
        }
        mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

        const result = await getTwilioStatus()
        expect(result).toBe(false)
      }
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(getTwilioStatus()).rejects.toThrow('Network error')
    })

    it('should handle HTTP errors', async () => {
      const mockResponse: MockResponse = {
        ok: false,
        status: 401,
        json: jest.fn().mockResolvedValueOnce({
          status: 'error'
        })
      }
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

      const result = await getTwilioStatus()
      expect(result).toBe(false)
    })
  })

  describe('getTwilioCallStatus', () => {
    const mockCallId = 'CA1234567890abcdef1234567890abcdef'
    
    const mockSuccessStatusResponse: TwilioCallStatusResponse = {
      success: true,
      call_sid: mockCallId,
      status: 'completed',
      direction: 'outbound-api',
      from_: '+15551234567',
      to: '+15559876543',
      duration: '30',
      price: '-0.02',
      price_unit: 'USD',
      date_created: '2024-01-01T00:00:00Z',
      date_updated: '2024-01-01T00:30:00Z',
      start_time: '2024-01-01T00:00:00Z',
      end_time: '2024-01-01T00:00:30Z',
      message: 'Call completed successfully'
    }

    const mockFailureStatusResponse: TwilioCallStatusResponse = {
      success: false,
      error: 'Call not found',
      message: 'No call found with the provided SID'
    }

    it('should successfully get call status', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockSuccessStatusResponse)
      }
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

      const result = await getTwilioCallStatus(mockCallId)
      
      expect(mockFetch).toHaveBeenCalledWith(
        `http://test-backend.com/twilio/status/${mockCallId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
      
      expect(result).toEqual(mockSuccessStatusResponse)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.call_sid).toBe(mockCallId)
        expect(result.status).toBe('completed')
      }
    })

    it('should handle call not found', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockFailureStatusResponse)
      }
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

      const result = await getTwilioCallStatus('invalid-call-id')
      
      expect(result).toEqual(mockFailureStatusResponse)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Call not found')
      }
    })

    it('should handle different call statuses', async () => {
      const statuses = ['queued', 'ringing', 'in-progress', 'completed', 'busy', 'failed', 'no-answer', 'canceled']
      
      for (const status of statuses) {
        const mockResponse: MockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValueOnce({
            ...mockSuccessStatusResponse,
            status
          })
        }
        mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

        const result = await getTwilioCallStatus(mockCallId)
        if (result.success) {
          expect(result.status).toBe(status)
        }
      }
    })

    it('should handle different call directions', async () => {
      const directions = ['inbound', 'outbound-api', 'outbound-dial']
      
      for (const direction of directions) {
        const mockResponse: MockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValueOnce({
            ...mockSuccessStatusResponse,
            direction
          })
        }
        mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

        const result = await getTwilioCallStatus(mockCallId)
        if (result.success) {
          expect(result.direction).toBe(direction)
        }
      }
    })

    it('should handle valid call SID formats', async () => {
      const validCallSids = [
        'CA1234567890abcdef1234567890abcdef',
        'CA1111111111111111111111111111111111',
        'CAabcdefabcdefabcdefabcdefabcdefabcd'
      ]
      
      for (const callSid of validCallSids) {
        const mockResponse: MockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValueOnce({
            ...mockSuccessStatusResponse,
            call_sid: callSid
          })
        }
        mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

        const result = await getTwilioCallStatus(callSid)
        if (result.success) {
          expect(result.call_sid).toBe(callSid)
        }
      }
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(getTwilioCallStatus(mockCallId)).rejects.toThrow('Network error')
    })

    it('should handle HTTP errors', async () => {
      const mockResponse: MockResponse = {
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValueOnce({
          error: 'Not found'
        })
      }
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

      const result = await getTwilioCallStatus(mockCallId)
      if (!result.success) {
        expect(result.error).toBe('Not found')
      }
    })

    it('should handle price information correctly', async () => {
      const pricedCall = {
        ...mockSuccessStatusResponse,
        price: '-0.0075',
        price_unit: 'EUR'
      }

      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValueOnce(pricedCall)
      }
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

      const result = await getTwilioCallStatus(mockCallId)
      if (result.success) {
        expect(result.price).toBe('-0.0075')
        expect(result.price_unit).toBe('EUR')
      }
    })

    it('should handle duration parsing', async () => {
      const longCall = {
        ...mockSuccessStatusResponse,
        duration: '3600'
      }

      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValueOnce(longCall)
      }
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

      const result = await getTwilioCallStatus(mockCallId)
      if (result.success) {
        expect(result.duration).toBe('3600')
      }
    })
  })
})