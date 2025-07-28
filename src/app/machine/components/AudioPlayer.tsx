import { PauseCircleOutline, PlayArrowOutlined, VolumeMute, VolumeUp } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

interface AudioData {
    url: string
    type: string
    size: number
    originalType: string
    contentType: string | null
}

export default function AudioPlayer({ audioData }: { audioData: AudioData | null }) {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [audioError, setAudioError] = useState<string>('')
    const [audioReady, setAudioReady] = useState(false)
    const [attemptedFormats, setAttemptedFormats] = useState<string[]>([])

    useEffect(() => {
        if (audioRef.current && audioData?.url) {
            const audio = audioRef.current

            // Reset states when new audio data is provided
            setAudioError('')
            setAudioReady(false)
            setIsPlaying(false)
            setAttemptedFormats([])

            // Add event listeners for debugging
            const handleLoadedData = () => {
                console.log('Audio loaded successfully')
                setAudioReady(true)
            }

            const handleCanPlay = () => {
                console.log('Audio can start playing')
                setAudioReady(true)
            }

            const handleError = (e: Event) => {
                const target = e.target as HTMLAudioElement
                let errorMessage = 'Unknown audio error'

                if (target.error) {
                    switch (target.error.code) {
                        case MediaError.MEDIA_ERR_ABORTED:
                            errorMessage = 'Audio loading aborted'
                            break
                        case MediaError.MEDIA_ERR_NETWORK:
                            errorMessage = 'Network error while loading audio'
                            break
                        case MediaError.MEDIA_ERR_DECODE:
                            errorMessage = 'Audio decoding error - unsupported format'
                            break
                        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                            errorMessage = 'Audio format not supported'
                            break
                    }
                }

                console.error('Audio error:', errorMessage, target.error)
                console.error('Failed audio type:', audioData.type)
                console.error('Audio metadata:', audioData)

                // Set error without trying alternatives for now to avoid loops
                setAudioError(errorMessage)
                setAudioReady(false)
            }

            const handleEnded = () => {
                setIsPlaying(false)
            }

            // Add all event listeners
            audio.addEventListener('loadeddata', handleLoadedData)
            audio.addEventListener('canplay', handleCanPlay)
            audio.addEventListener('error', handleError)
            audio.addEventListener('ended', handleEnded)

            // Try to load the audio
            audio.load()

            // Cleanup function
            return () => {
                audio.removeEventListener('loadeddata', handleLoadedData)
                audio.removeEventListener('canplay', handleCanPlay)
                audio.removeEventListener('error', handleError)
                audio.removeEventListener('ended', handleEnded)
            }
        }
    }, [audioData])

    const handlePlayPause = async () => {
        if (audioRef.current && audioReady) {
            try {
                if (isPlaying) {
                    audioRef.current.pause()
                    setIsPlaying(false)
                } else {
                    await audioRef.current.play()
                    setIsPlaying(true)
                }
            } catch (error) {
                console.error('Error playing audio:', error)
                setAudioError('Failed to play audio: ' + (error as Error).message)
            }
        }
    }

    const handleMuteUnmute = () => {
        setIsMuted(!isMuted)
        if (audioRef.current) {
            audioRef.current.muted = !isMuted
        }
    }

    // const handleDownloadAudio = () => {
    //     if (audioData?.url) {
    //         const link = document.createElement('a')
    //         link.href = audioData.url
    //         link.download = 'generated-audio.mp3'
    //         document.body.appendChild(link)
    //         link.click()
    //         document.body.removeChild(link)
    //     }
    // }

    // const checkAudioHeaders = async () => {
    //     if (audioData?.url) {
    //         try {
    //             const response = await fetch(audioData.url)
    //             const arrayBuffer = await response.arrayBuffer()
    //             const uint8Array = new Uint8Array(arrayBuffer)

    //             // Check for MP3 header (first few bytes)
    //             const headerBytes = Array.from(uint8Array.slice(0, 10))
    //                 .map((b) => b.toString(16).padStart(2, '0'))
    //                 .join(' ')

    //             console.log('Audio file header bytes:', headerBytes)
    //             console.log('File size in bytes:', arrayBuffer.byteLength)

    //             // Check if it starts with ID3 tag or MP3 sync
    //             if (uint8Array[0] === 0x49 && uint8Array[1] === 0x44 && uint8Array[2] === 0x33) {
    //                 console.log('✓ File has ID3 tag (likely valid MP3)')
    //             } else if (uint8Array[0] === 0xff && (uint8Array[1] & 0xe0) === 0xe0) {
    //                 console.log('✓ File has MP3 sync header')
    //             } else {
    //                 console.log('⚠️ File does not appear to be a valid MP3')
    //             }
    //         } catch (error) {
    //             console.error('Error checking audio headers:', error)
    //         }
    //     }
    // }

    if (!audioData) {
        return <Typography>No audio yet.</Typography>
    }

    return (
        <>
            <Box>
                {/* Show audio status for debugging */}
                <Typography variant='caption' color='textSecondary'>
                    Audio Status: {audioReady ? 'Ready' : 'Loading...'}
                    {audioError && ` | Error: ${audioError}`}
                </Typography>

                {/* Audio metadata for debugging */}
                <Typography variant='caption' color='textSecondary' component='div'>
                    Format: {audioData.type} | Size: {(audioData.size / 1024).toFixed(1)}KB
                    {attemptedFormats.length > 0 && ` | Tried: ${attemptedFormats.join(', ')}`}
                </Typography>

                {/* player box */}
                <Box>
                    <audio ref={audioRef} src={audioData.url} preload='metadata' />
                    <IconButton onClick={handlePlayPause} disabled={!audioReady}>
                        {isPlaying ? <PauseCircleOutline /> : <PlayArrowOutlined />}
                    </IconButton>
                    <IconButton onClick={handleMuteUnmute}>{isMuted ? <VolumeMute /> : <VolumeUp />}</IconButton>
                </Box>

                {/* Debug tools */}
                {/* <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    <IconButton size='small' onClick={handleDownloadAudio} title='Download audio file to inspect'>
                        📥
                    </IconButton>
                    <IconButton size='small' onClick={checkAudioHeaders} title='Check audio file headers'>
                        🔍
                    </IconButton>
                </Box> */}

                {/* Debug info */}
                {/* <Typography variant='caption' color='textSecondary'>
                    Audio URL: {audioData.url.substring(0, 50)}...
                </Typography> */}
            </Box>
        </>
    )
}
