// Copyright (C) 2025 AIDC-AI
// Licensed under the MIT License.
import React, { createContext, useContext, useReducer, Dispatch, useRef } from 'react';
import { Message } from '../types/types';
import { app } from '../utils/comfyapp';

// Add tab type definition
export type TabType = 'chat' | 'parameter-debug';

// Interface for tracking ParameterDebugInterface screen state
export interface ScreenState {
  currentScreen: number;
  isProcessing: boolean;
  isCompleted: boolean;
}

interface ChatState {
  messages: Message[];
  selectedNode: any | null;
  installedNodes: any[];
  loading: boolean;
  sessionId: string | null;
  showChat: boolean;
  activeTab: TabType;
  screenState: ScreenState | null; // Add screen state
}

type ChatAction = 
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: Message }
  | { type: 'SET_SELECTED_NODE'; payload: any }
  | { type: 'SET_INSTALLED_NODES'; payload: any[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SESSION_ID'; payload: string }
  | { type: 'SET_SHOW_CHAT'; payload: boolean }
  | { type: 'SET_ACTIVE_TAB'; payload: TabType }
  | { type: 'SET_SCREEN_STATE'; payload: ScreenState | null } // Add action for setting screen state
  | { type: 'CLEAR_MESSAGES' }

const initialState: ChatState = {
  messages: [],
  selectedNode: Object.keys(app?.canvas?.selected_nodes ?? {})?.length ? Object.values(app?.canvas?.selected_nodes) : null,
  installedNodes: [],
  loading: false,
  sessionId: null,
  showChat: false,
  activeTab: 'chat',
  screenState: null, // Initialize as null
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg => 
          msg.id === action.payload.id && !msg.finished ? action.payload : msg
        )
      };
    case 'SET_SELECTED_NODE':
      return { ...state, selectedNode: action.payload };
    case 'SET_INSTALLED_NODES':
      return { ...state, installedNodes: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload };
    case 'SET_SHOW_CHAT':
      return { ...state, showChat: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_SCREEN_STATE':
      return { ...state, screenState: action.payload };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    default:
      return state;
  }
}

const ChatContext = createContext<{
  state: ChatState;
  dispatch: Dispatch<ChatAction>;
  isAutoScroll: React.MutableRefObject<boolean>;
  showcasIng: React.MutableRefObject<boolean>;
  abortControllerRef: React.RefObject<AbortController | null>;
}>({ state: initialState, dispatch: () => null, isAutoScroll: {current: true}, showcasIng: {current: false}, abortControllerRef: {current: null} });

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // 处理chat是否自动滚动-true: 表示会自动根据内容滚动到最下面，false: 表示不会自动滚动
  const isAutoScroll = useRef<boolean>(true);
  const showcasIng = useRef<boolean>(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Update localStorage cache when messages or sessionId changes
  React.useEffect(() => {
    if (state.sessionId && state.messages.length > 0) {
      localStorage.setItem(`messages_${state.sessionId}`, JSON.stringify(state.messages));
    }
  }, [state.messages, state.sessionId]);

  return (
    <ChatContext.Provider value={{ state, dispatch, isAutoScroll, showcasIng, abortControllerRef }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
} 