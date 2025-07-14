import React, { useEffect, useRef, useState } from 'react';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Box, Button, IconButton, Menu, MenuItem, Slider, Typography, useMediaQuery, useTheme } from '@mui/material';

interface Props {
  src: string;
  fullscreen?: boolean;
}

export function CustomVideoPlayer({ src, fullscreen }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreenInternal, setIsFullscreenInternal] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const openMenu = Boolean(anchorEl);

  let hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const handleProgressChange = (_: any, value: number | number[]) => {
    if (!videoRef.current || typeof value !== 'number') return;
    videoRef.current.currentTime = (value / 100) * duration;
    setProgress(value);
  };

  const handleVolumeChange = (_: any, value: number | number[]) => {
    if (!videoRef.current || typeof value !== 'number') return;
    videoRef.current.volume = value;
    setVolume(value);
    setMuted(value === 0);
  };

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreenInternal(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreenInternal(false));
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const sec = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${min}:${sec}`;
  };

  const resetHideControlsTimer = () => {
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    setShowControls(true);
    hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
    handleCloseMenu();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        setDuration(video.duration);
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = () => resetHideControlsTimer();
    const handleFullscreenChange = () => {
      setIsFullscreenInternal(Boolean(document.fullscreenElement));
      resetHideControlsTimer();
    };

    container.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    resetHideControlsTimer();

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <video
        ref={videoRef}
        src={src}
        controls={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: isFullscreenInternal || fullscreen ? 'contain' : 'cover',
          backgroundColor: '#000',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
        onClick={togglePlay}
      />

      {/* Overlay + Controls */}
      {showControls && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(3px)',
            py: 0.5,
            px: isMobile ? 1 : 2,
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 0.1 : 1,
            zIndex: 10,
          }}
        >
          <IconButton
            onClick={togglePlay}
            sx={{ color: theme.palette.primary.main, fontSize: 24, p: isMobile ? 1.0 : 1.5 }}
          >
            {isPlaying ? <PauseIcon fontSize="inherit" /> : <PlayArrowIcon fontSize="inherit" />}
          </IconButton>

          <IconButton
            onClick={toggleMute}
            sx={{ color: theme.palette.primary.main, fontSize: 24, p: isMobile ? 1.0 : 1.5 }}
          >
            {muted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </IconButton>

          {!(isMobile && !isFullscreenInternal) && (
            <Slider
              value={volume}
              onChange={handleVolumeChange}
              min={0}
              max={1}
              step={0.01}
              sx={{ width: isMobile ? 60 : 80, color: theme.palette.primary.main, height: 2 }}
            />
          )}

          <Box flexGrow={2} />

          {!(isMobile && !isFullscreenInternal) ? (
            <>
              <Typography
                variant="body2"
                sx={{
                  minWidth: isMobile ? 30 : 50,
                  color: '#fff',
                  fontWeight: 'bold',
                }}
              >
                {formatTime((progress / 100) * duration)}
              </Typography>

              <Slider
                value={progress}
                onChange={handleProgressChange}
                sx={{ color: theme.palette.primary.main, height: 2 }}
              />

              <Box flexGrow={2} />

              <Typography
                variant="body2"
                sx={{
                  minWidth: isMobile ? 30 : 50,
                  color: '#fff',
                  fontWeight: 'bold',
                }}
              >
                {formatTime(duration)}
              </Typography>
            </>
          ) : (
            <>
              <Typography
                variant="body2"
                sx={{
                  color: '#fff',
                }}
              >
                {formatTime((progress / 100) * duration)}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: '#fff',
                }}
              >
                {formatTime(duration)}
              </Typography>
            </>
          )}
          <Box>
            <Button
              onClick={handleOpenMenu}
              sx={{
                fontSize: 14,
                fontWeight: 600,
                p: 1.5,
                minWidth: 36,
                px: 1,
                py: 0.5,
                color: theme.palette.primary.main,
                border: '1px solid',
                borderColor: theme.palette.primary.main,
                textTransform: 'none',
              }}
            >
              {playbackRate}x
            </Button>

            <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu} PaperProps={{ sx: { minWidth: 80 } }}>
              {[1, 1.25, 1.5].map((rate) => (
                <MenuItem
                  key={rate}
                  selected={rate === playbackRate}
                  onClick={() => changePlaybackRate(rate)}
                  sx={{ fontSize: 14, py: 1 }}
                >
                  {rate}x
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <IconButton onClick={handleFullscreen} sx={{ color: theme.palette.primary.main, fontSize: 24, p: 1.5 }}>
            {isFullscreenInternal ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
