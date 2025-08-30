import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Avatar, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Typography,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Badge,
  Divider,
  Drawer,
  Switch,
  FormControlLabel,
  Menu,
  MenuItem,
  Fade,
  Zoom
} from '@mui/material';
import { 
  Send as SendIcon,
  SmartToy as SmartToyIcon,
  Person as PersonIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Delete as ClearIcon,
  Settings as SettingsIcon,
  Bolt as BoltIcon,
  EmojiEmotions as EmojiIcon,
  Palette as PaletteIcon,
  Code as CodeIcon,
  Smartphone as MobileIcon,
  Laptop as DesktopIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import solveDoubt from './utils/Bot'

// Futuristic color palettes
const themePalettes = {
  dark: {
    primary: '#00f5d4', // Cyan
    secondary: '#9b5de5', // Purple
    accent: '#f15bb5', // Pink
    bg: '#0a192f', // Navy
    bubble: '#172a45', // Dark navy
    text: '#e6f1ff', // Light blue
    secondaryText: '#8892b0', // Grayish blue
    userText: '#0a192f' // Navy
  },
  light: {
    primary: '#5e35b1', // Deep purple
    secondary: '#29b6f6', // Light blue
    accent: '#ff7043', // Coral
    bg: '#f8f9ff', // Light
    bubble: '#ffffff', // White
    text: '#263238', // Dark gray
    secondaryText: '#78909c', // Medium gray
    userText: '#37474f' // Dark blue-gray
  },
  professional: {
    primary: '#2e7d32', // Deep green
    secondary: '#1565c0', // Navy blue
    accent: '#d32f2f', // Crimson
    bg: '#f5f7fa', // Light gray-blue
    bubble: '#ffffff', // White
    text: '#263238', // Dark gray
    secondaryText: '#607d8b', // Blue-gray
    userText: '#37474f' // Dark blue-gray
  }
};

const GlassPaper = styled(Paper)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.85),
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  overflow: 'hidden',
}));

const AppAvatar = styled(Avatar)(({ theme }) => ({
  border: `2px solid ${theme.palette.primary.main}`,
  background: 'transparent',
  color: theme.palette.primary.main,
  width: 36,
  height: 36,
  '& svg': {
    fontSize: '1rem'
  }
}));

const MessageBubble = styled(Paper)(({ theme, sender }) => ({
  padding: theme.spacing(1.5, 2),
  marginLeft: sender === 'bot' ? 0 : theme.spacing(2),
  marginRight: sender === 'user' ? 0 : theme.spacing(2),
  backgroundColor: sender === 'bot' ? theme.palette.bubble : theme.palette.userBubble,
  color: sender === 'bot' ? theme.palette.text : theme.palette.userText,
  borderRadius: sender === 'bot' ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
  maxWidth: '85%',
  wordWrap: 'break-word',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  border: sender === 'bot' ? 'none' : `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  position: 'relative',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: '14px',
    height: '14px',
    bottom: 0,
    left: sender === 'bot' ? '-14px' : 'auto',
    right: sender === 'user' ? '-14px' : 'auto',
    backgroundColor: sender === 'bot' ? theme.palette.bubble : theme.palette.userBubble,
    clipPath: sender === 'bot' ? 'polygon(0 0, 100% 100%, 0 100%)' : 'polygon(100% 0, 0 100%, 100% 100%)',
    transform: sender === 'bot' ? 'none' : 'rotateY(180deg)'
  }
}));

const ChatBot = () => {
  const [themeMode, setThemeMode] = useState('dark');
  const themeColors = themePalettes[themeMode];
  
  // Create a custom theme object
  const theme = {
    palette: {
      primary: { main: themeColors.primary },
      secondary: { main: themeColors.secondary },
      background: { 
        default: themeColors.bg, 
        paper: alpha(themeColors.bubble, 0.9) 
      },
      bubble: themeColors.bubble,
      userBubble: themeMode === 'dark' ? themeColors.primary : '#ffffff',
      text: themeColors.text,
      secondaryText: themeColors.secondaryText,
      userText: themeColors.userText,
      divider: alpha(themeColors.secondaryText, 0.2)
    }
  };
  
  const [messages, setMessages] = useState([
    { 
      text: "Hello, I'm **Maverick**, your AI assistant. What can I help you with today?", 
      sender: 'bot', 
      timestamp: new Date(),
      reactions: []
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const [deviceView, setDeviceView] = useState('desktop');
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { 
        text: input, 
        sender: 'user', 
        timestamp: new Date(),
        reactions: []
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);
      
      try {
        // In a real app, you would call your AI service here
        const response = await solveDoubt(input);
        // const response = "I'm your AI assistant. This is a simulated response. In a real application, I would provide a thoughtful answer to your query: \n\n```\n" + input + "\n```";
        
        const botMessage = { 
          text: response, 
          sender: 'bot', 
          timestamp: new Date(),
          reactions: []
        };
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Error:', error);
        const errorMessage = { 
          text: "⚠️ Sorry, I'm experiencing technical difficulties. Please try again later.", 
          sender: 'bot', 
          timestamp: new Date(),
          reactions: []
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{ 
      text: "Chat history cleared. What would you like to discuss now?", 
      sender: 'bot', 
      timestamp: new Date(),
      reactions: []
    }]);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleReaction = (msgIndex, emoji) => {
    setMessages(prev => prev.map((msg, idx) => {
      if (idx === msgIndex) {
        const hasReaction = msg.reactions.includes(emoji);
        return {
          ...msg,
          reactions: hasReaction 
            ? msg.reactions.filter(e => e !== emoji)
            : [...msg.reactions, emoji]
        };
      }
      return msg;
    }));
  };

  const emojiOptions = ['👍', '❤️', '🔥', '👏', '🤔', '🎉', '💡', '🚀'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const markdownComponents = {
    p: ({node, ...props}) => <p style={{margin: '8px 0', lineHeight: 1.6}} {...props} />,
    strong: ({node, ...props}) => <strong style={{fontWeight: 600, color: theme.palette.primary.main}} {...props} />,
    em: ({node, ...props}) => <em style={{fontStyle: 'italic'}} {...props} />,
    code: ({node, ...props}) => (
      <code 
        style={{
          display: 'block',
          backgroundColor: themeMode === 'dark' ? '#112240' : '#f0f0f0',
          color: themeMode === 'dark' ? theme.palette.primary.main : theme.palette.userText,
          padding: '8px 12px',
          borderRadius: '4px',
          margin: '8px 0',
          fontFamily: '"Fira Code", monospace',
          whiteSpace: 'pre-wrap',
          fontSize: '0.85rem',
          borderLeft: `3px solid ${theme.palette.secondary.main}`
        }} 
        {...props} 
      />
    ),
    ul: ({node, ...props}) => <ul style={{paddingLeft: '20px', margin: '8px 0', listStyleType: 'none'}} {...props} />,
    ol: ({node, ...props}) => <ol style={{paddingLeft: '20px', margin: '8px 0'}} {...props} />,
    li: ({node, ...props}) => <li style={{marginBottom: '4px', position: 'relative', paddingLeft: '16px'}} {...props} />,
    blockquote: ({node, ...props}) => (
      <blockquote 
        style={{
          borderLeft: `3px solid ${theme.palette.secondary.main}`,
          paddingLeft: '12px',
          margin: '12px 0',
          color: theme.palette.secondaryText,
          fontStyle: 'italic'
        }} 
        {...props} 
      />
    ),
    a: ({node, ...props}) => <a style={{
      color: theme.palette.primary.main, 
      textDecoration: 'none', 
      borderBottom: `1px dashed ${alpha(theme.palette.primary.main, 0.5)}`,
      transition: 'all 0.2s ease',
      '&:hover': {
        borderBottom: `2px solid ${theme.palette.primary.main}`
      }
    }} {...props} />,
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '90vh',
      width: deviceView === 'desktop' ? '85%' : '95%',
      maxWidth: deviceView === 'desktop' ? '1200px' : '500px',
      margin: '2vh auto',
      backgroundColor: theme.palette.background.default,
      borderRadius: '20px',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden',
      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      position: 'relative',
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        zIndex: 1
      },
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <GlassPaper elevation={0} sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: theme.palette.secondary.main,
                border: `2px solid ${theme.palette.background.paper}`,
                boxShadow: `0 0 0 2px ${alpha(theme.palette.secondary.main, 0.3)}`
              }}/>
            }
          >
            <AppAvatar sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: theme.palette.background.paper
            }}>
              <BoltIcon fontSize="small" />
            </AppAvatar>
          </Badge>
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 700, 
              lineHeight: 1,
              color: theme.palette.text
            }}>
              Maverick AI
            </Typography>
            <Typography variant="caption" sx={{ 
              color: theme.palette.secondaryText,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              <Box component="span" sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                backgroundColor: theme.palette.secondary.main,
                display: 'inline-block',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 0.5 },
                  '50%': { opacity: 1 },
                  '100%': { opacity: 0.5 }
                }
              }}/>
              Online · Ready to assist
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Device View">
            <IconButton 
              size="small" 
              onClick={() => setDeviceView(deviceView === 'desktop' ? 'mobile' : 'desktop')}
              sx={{ 
                color: theme.palette.text,
                '&:hover': {
                  color: theme.palette.primary.main
                }
              }}
            >
              {deviceView === 'desktop' ? <DesktopIcon fontSize="small" /> : <MobileIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Theme">
            <IconButton 
              size="small" 
              onClick={() => {
                const modes = Object.keys(themePalettes);
                const currentIndex = modes.indexOf(themeMode);
                setThemeMode(modes[(currentIndex + 1) % modes.length]);
              }}
              sx={{ 
                color: theme.palette.text,
                '&:hover': {
                  color: theme.palette.primary.main
                }
              }}
            >
              <PaletteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton 
              size="small" 
              onClick={() => setSettingsOpen(true)}
              sx={{ 
                color: theme.palette.text,
                '&:hover': {
                  color: theme.palette.primary.main
                }
              }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear chat">
            <IconButton 
              size="small" 
              onClick={clearChat}
              sx={{ 
                color: theme.palette.text,
                '&:hover': {
                  color: theme.palette.secondary.main
                }
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </GlassPaper>

      {/* Messages Area */}
      <Box sx={{
        flex: 1,
        overflowY: 'auto',
        padding: 3,
        backgroundColor: themeMode === 'dark' 
          ? alpha(theme.palette.background.default, 0.9)
          : theme.palette.background.default,
        backgroundImage: themeMode === 'dark' 
          ? 'radial-gradient(circle at 10% 20%, rgba(23, 42, 69, 0.1) 0%, rgba(10, 25, 47, 0.1) 90%)' 
          : 'none',
        '&::-webkit-scrollbar': {
          width: '8px'
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          background: `linear-gradient(${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          borderRadius: '4px'
        }
      }}>
        <List sx={{ 
          '& .MuiListItem-root': { 
            paddingX: 0, 
            paddingY: 1.5,
            transition: 'all 0.3s ease'
          } 
        }}>
          {messages.map((message, index) => (
            <Fade in={true} key={index}>
              <ListItem 
                sx={{
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start'
                }}
              >
                {message.sender === 'bot' && (
                  <ListItemAvatar sx={{ minWidth: '44px', marginTop: '4px' }}>
                    <AppAvatar sx={{ backgroundColor: 'transparent' }}>
                      <SmartToyIcon />
                    </AppAvatar>
                  </ListItemAvatar>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <MessageBubble elevation={0} sender={message.sender}>
                    {message.sender === 'bot' ? (
                      <ReactMarkdown 
                        components={markdownComponents}
                        children={message.text}
                      />
                    ) : (
                      <ListItemText 
                        primary={message.text}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontSize: '0.95rem',
                            lineHeight: 1.5,
                            fontWeight: 500
                          }
                        }}
                      />
                    )}
                    <Typography 
                      variant="caption" 
                      sx={{
                        display: 'block',
                        textAlign: 'right',
                        color: message.sender === 'bot' ? theme.palette.secondaryText : alpha(theme.palette.userText, 0.7),
                        fontSize: '0.7rem',
                        marginTop: 0.5
                      }}
                    >
                      {formatTime(message.timestamp)}
                    </Typography>
                  </MessageBubble>
                  {message.reactions.length > 0 && (
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 0.5, 
                      marginTop: 0.5,
                      marginLeft: message.sender === 'bot' ? '54px' : 'auto',
                      marginRight: message.sender === 'user' ? '54px' : 'auto'
                    }}>
                      {message.reactions.map((emoji, idx) => (
                        <Zoom in={true} key={idx}>
                          <Box 
                            sx={{ 
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              borderRadius: '12px',
                              paddingX: 1,
                              paddingY: 0.3,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.2)
                              }
                            }}
                            onClick={() => toggleReaction(index, emoji)}
                          >
                            {emoji}
                          </Box>
                        </Zoom>
                      ))}
                    </Box>
                  )}
                </Box>
                {message.sender === 'user' && (
                  <ListItemAvatar sx={{ minWidth: '44px', marginTop: '4px' }}>
                    <AppAvatar sx={{ 
                      backgroundColor: theme.palette.userBubble,
                      color: theme.palette.userText
                    }}>
                      <PersonIcon />
                    </AppAvatar>
                  </ListItemAvatar>
                )}
              </ListItem>
            </Fade>
          ))}
          {isTyping && (
            <ListItem sx={{ justifyContent: 'flex-start' }}>
              <ListItemAvatar sx={{ minWidth: '44px' }}>
                <AppAvatar>
                  <SmartToyIcon />
                </AppAvatar>
              </ListItemAvatar>
              <MessageBubble elevation={0} sender="bot">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {[1, 2, 3].map((dot) => (
                      <Box key={dot} sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main,
                        opacity: 0,
                        animation: 'pulse 1.5s infinite',
                        animationDelay: `${dot * 0.3}s`,
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 0.3 },
                          '50%': { opacity: 1 }
                        }
                      }}/>
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ color: theme.palette.text }}>
                    Maverick is thinking...
                  </Typography>
                </Box>
              </MessageBubble>
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Input Area */}
      <GlassPaper elevation={0} sx={{
        padding: 2,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.03)})`
      }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center',
          position: 'relative'
        }}>
          <IconButton
            size="small"
            onClick={(e) => setEmojiAnchor(e.currentTarget)}
            sx={{
              color: theme.palette.text,
              '&:hover': {
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            <EmojiIcon />
          </IconButton>
          
          <Menu
            anchorEl={emojiAnchor}
            open={Boolean(emojiAnchor)}
            onClose={() => setEmojiAnchor(null)}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: theme.palette.background.paper,
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              padding: 1,
              flexWrap: 'wrap',
              width: '200px'
            }}>
              {emojiOptions.map((emoji, idx) => (
                <IconButton
                  key={idx}
                  onClick={() => {
                    setInput(prev => prev + emoji);
                    setEmojiAnchor(null);
                  }}
                  sx={{
                    fontSize: '1.2rem',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.2)'
                    }
                  }}
                >
                  {emoji}
                </IconButton>
              ))}
            </Box>
          </Menu>
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Message Maverick..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '24px',
                color: theme.palette.text,
                '& fieldset': {
                  borderColor: alpha(theme.palette.divider, 0.3)
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                }
              },
              '& .MuiInputBase-input': {
                fontSize: '0.9rem',
                padding: '12px 16px'
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={!input.trim()}
            sx={{
              minWidth: '48px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: theme.palette.background.paper,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`
              },
              '&:disabled': {
                background: theme.palette.secondaryText,
                color: theme.palette.background.paper
              },
              transition: 'all 0.2s ease'
            }}
          >
            <SendIcon fontSize="small" />
          </Button>
        </Box>
        <Typography variant="caption" sx={{
          display: 'block',
          textAlign: 'center',
          marginTop: 1,
          color: theme.palette.secondaryText,
          fontSize: '0.7rem'
        }}>
          Maverick AI · May produce inaccurate information
        </Typography>
      </GlassPaper>

      {/* Settings Drawer */}
      <Drawer
        anchor="right"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            backgroundColor: theme.palette.background.paper,
            backdropFilter: 'blur(10px)',
            padding: 3
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
          <SettingsIcon sx={{ marginRight: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ color: theme.palette.text }}>
            Settings
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" sx={{ 
          marginBottom: 2,
          color: theme.palette.text,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <PaletteIcon fontSize="small" /> Theme Settings
        </Typography>
        
        <FormControlLabel
          control={
            <Switch 
              checked={themeMode === 'dark'} 
              onChange={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
              color="primary"
            />
          }
          label="Dark Mode"
          sx={{ marginBottom: 1, color: theme.palette.text }}
        />
        
        <FormControlLabel
          control={
            <Switch 
              checked={themeMode === 'professional'} 
              onChange={() => setThemeMode(themeMode === 'professional' ? 'dark' : 'professional')}
              color="primary"
            />
          }
          label="Professional Theme"
          sx={{ marginBottom: 2, color: theme.palette.text }}
        />
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" sx={{ 
          marginBottom: 2,
          color: theme.palette.text,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <CodeIcon fontSize="small" /> Chat Settings
        </Typography>
        
        <Button
          variant="outlined"
          onClick={clearChat}
          startIcon={<ClearIcon />}
          fullWidth
          sx={{ 
            marginBottom: 2, 
            color: theme.palette.text, 
            borderColor: theme.palette.divider,
            '&:hover': {
              borderColor: theme.palette.primary.main
            }
          }}
        >
          Clear Chat History
        </Button>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" sx={{ 
          marginBottom: 2,
          color: theme.palette.text,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <BoltIcon fontSize="small" /> AI Capabilities
        </Typography>
        
        <Box sx={{ 
          backgroundColor: alpha(theme.palette.primary.main, 0.05), 
          borderRadius: '12px', 
          padding: 2,
          marginBottom: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
            <CheckIcon sx={{ fontSize: 16, color: theme.palette.primary.main, marginRight: 1 }} />
            <Typography variant="body2" sx={{ color: theme.palette.text }}>
              Natural Language Processing
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
            <CheckIcon sx={{ fontSize: 16, color: theme.palette.primary.main, marginRight: 1 }} />
            <Typography variant="body2" sx={{ color: theme.palette.text }}>
              Code Generation
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckIcon sx={{ fontSize: 16, color: theme.palette.primary.main, marginRight: 1 }} />
            <Typography variant="body2" sx={{ color: theme.palette.text }}>
              Contextual Understanding
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ChatBot;