import { PauseCircleOutline, PlayArrowOutlined, VolumeMute, VolumeUp } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

export default function AudioPlayer({ audioUrl }: { audioUrl: string }) {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    // const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)

    useEffect(() => {
        if (audioRef) {
            console.log(audioRef)
        }
    }, [audioRef])

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }
    // const handleVolumeChange = (newValue: number) => {
    //     setVolume(newValue)
    //     setIsMuted(newValue === 0)
    // }
    const handleMuteUnmute = () => {
        setIsMuted(!isMuted)
        if (audioRef.current) {
            audioRef.current.muted = !isMuted
            // setVolume(isMuted ? 1 : 0)
        }
    }

    if (!audioUrl) {
        return <Typography>No audio yet.</Typography>
    }

    return (
        <>
            <Box>
                {/* <Typography>audioUrl: {audioUrl}</Typography> */}
                {/* player box */}
                <Box>
                    <audio ref={audioRef} src={audioUrl}></audio>
                    <IconButton onClick={handlePlayPause}>
                        {isPlaying ? <PauseCircleOutline /> : <PlayArrowOutlined />}
                    </IconButton>
                    <IconButton onClick={handleMuteUnmute}>{isMuted ? <VolumeMute /> : <VolumeUp />}</IconButton>
                    {/* <Box>
                        <Slider
                            value={volume}
                            onChange={(e) => handleVolumeChange((e.target as HTMLInputElement)?.valueAsNumber)}
                            aria-label='volume'
                            step={0.01}
                            min={0}
                            max={1}
                        />
                    </Box> */}
                </Box>
            </Box>
        </>
    )
}
