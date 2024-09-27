import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    unsetUser: (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // OR:
    // login: (state, action) => ({
    //   isAuthenticated: true,
    //   user: action.payload.user,
    // }),
    // logout: (state, action) => ({ isAuthenticated: false, user: null }),
  },
});

const extractTags = (notes = []) => {
  const tagsArray = notes.map((note) => note.tags); // Array of tags Arrays from each note
  const tags = new Set(tagsArray.flat()); // Flat the internal arrays, and getting unique tags out of the arrays
  return [...tags]; // Tags is implemented as an array, not a set
};

const initialNotesState = { notes: [], tags: [] };
const notesSlice = createSlice({
  name: "notes",
  initialState: initialNotesState,
  reducers: {
    setNotes: (state, action) => {
      state.notes = action.payload.notes;
      state.tags = extractTags(state.notes);
    },
    addNote: (state, action) => {
      const { note } = action.payload;
      state.notes.push(note);
      state.tags = extractTags(state.notes);
    },
    deleteNote: (state, action) => {
      const idToDelete = action.payload;
      state.notes = state.notes.filter((note) => note._id !== idToDelete);
      state.tags = extractTags(state.notes);
    },
  },
});

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    notes: notesSlice.reducer,
  },
});

export const authActions = authSlice.actions;
export const notesActions = notesSlice.actions;
export default store;
