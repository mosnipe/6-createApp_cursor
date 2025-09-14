import { createSlice, createAsyncThunk, PayloadAction, configureStore } from '@reduxjs/toolkit';
import { Event, TextItem, Character, HeaderSettings, UpdateEventRequest, CreateTextRequest, UpdateTextRequest } from '../types';
import { eventService, textService } from '../services/api';

// イベント一覧の状態
interface EventsState {
  list: Event[];
  loading: boolean;
  error: string | null;
}

// 現在のイベントの状態
interface CurrentEventState {
  event: Event | null;
  loading: boolean;
  error: string | null;
}

// UI状態
interface UIState {
  sidebarOpen: boolean;
  previewMode: boolean;
  dragIndex: number | null;
}

// ルート状態
export interface RootState {
  events: EventsState;
  currentEvent: CurrentEventState;
  ui: UIState;
}

// 非同期アクション
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async () => {
    const events = await eventService.getEvents();
    return events;
  }
);

export const fetchEvent = createAsyncThunk(
  'currentEvent/fetchEvent',
  async (id: string) => {
    const event = await eventService.getEvent(id);
    return event;
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData: { title: string; description?: string }) => {
    const event = await eventService.createEvent(eventData);
    return event;
  }
);

export const updateEvent = createAsyncThunk(
  'currentEvent/updateEvent',
  async ({ id, eventData }: { id: string; eventData: UpdateEventRequest }) => {
    const event = await eventService.updateEvent(id, eventData);
    return event;
  }
);

export const saveStoryEvent = createAsyncThunk(
  'currentEvent/saveStoryEvent',
  async ({ id, eventData }: { id: string; eventData: UpdateEventRequest }) => {
    const event = await eventService.updateEvent(id, eventData);
    return event;
  }
);

export const createText = createAsyncThunk(
  'currentEvent/createText',
  async ({ eventId, textData }: { eventId: string; textData: CreateTextRequest }) => {
    const text = await textService.createText(eventId, textData);
    return text;
  }
);

export const updateText = createAsyncThunk(
  'currentEvent/updateText',
  async ({ id, textData }: { id: string; textData: UpdateTextRequest }) => {
    const text = await textService.updateText(id, textData);
    return text;
  }
);

export const deleteText = createAsyncThunk(
  'currentEvent/deleteText',
  async (id: string) => {
    await textService.deleteText(id);
    return id;
  }
);

export const reorderTexts = createAsyncThunk(
  'currentEvent/reorderTexts',
  async (textIds: string[]) => {
    await textService.reorderTexts({ textIds });
    return textIds;
  }
);

// イベント一覧スライス
const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    list: [],
    loading: false,
    error: null,
  } as EventsState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch events';
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create event';
      });
  },
});

// 現在のイベントスライス
const currentEventSlice = createSlice({
  name: 'currentEvent',
  initialState: {
    event: null,
    loading: false,
    error: null,
  } as CurrentEventState,
  reducers: {
    setEvent: (state, action: PayloadAction<Event>) => {
      state.event = action.payload;
    },
    updateTexts: (state, action: PayloadAction<TextItem[]>) => {
      if (state.event) {
        state.event.texts = action.payload;
      }
    },
    updateCharacters: (state, action: PayloadAction<Character[]>) => {
      if (state.event) {
        state.event.characters = action.payload;
      }
    },
    setBackgroundImage: (state, action: PayloadAction<string | null>) => {
      if (state.event) {
        state.event.backgroundImage = action.payload;
      }
    },
    setHeaderSettings: (state, action: PayloadAction<HeaderSettings>) => {
      if (state.event) {
        state.event.headerSettings = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload;
      })
      .addCase(fetchEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch event';
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.event = action.payload;
      })
      .addCase(saveStoryEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveStoryEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload;
      })
      .addCase(saveStoryEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save story event';
      })
      .addCase(createText.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createText.fulfilled, (state, action) => {
        state.loading = false;
        if (state.event) {
          state.event.texts.push(action.payload);
        }
      })
      .addCase(createText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create text';
      })
      .addCase(updateText.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateText.fulfilled, (state, action) => {
        state.loading = false;
        if (state.event) {
          const index = state.event.texts.findIndex(text => text.id === action.payload.id);
          if (index !== -1) {
            state.event.texts[index] = action.payload;
          }
        }
      })
      .addCase(updateText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update text';
      })
      .addCase(deleteText.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteText.fulfilled, (state, action) => {
        state.loading = false;
        if (state.event) {
          state.event.texts = state.event.texts.filter(text => text.id !== action.payload);
        }
      })
      .addCase(deleteText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete text';
      })
      .addCase(reorderTexts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reorderTexts.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(reorderTexts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to reorder texts';
      });
  },
});

// UIスライス
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    previewMode: false,
    dragIndex: null,
  } as UIState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.previewMode = action.payload;
    },
    setDragIndex: (state, action: PayloadAction<number | null>) => {
      state.dragIndex = action.payload;
    },
  },
});

export const { clearError: clearEventsError } = eventsSlice.actions;
export const { 
  setEvent, 
  updateTexts, 
  updateCharacters, 
  setBackgroundImage, 
  setHeaderSettings,
  clearError: clearCurrentEventError 
} = currentEventSlice.actions;
export const { toggleSidebar, setPreviewMode, setDragIndex } = uiSlice.actions;

// ストア設定
const store = configureStore({
  reducer: {
    events: eventsSlice.reducer,
    currentEvent: currentEventSlice.reducer,
    ui: uiSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export default store;
