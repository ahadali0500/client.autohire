import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { agentAPI } from '@/lib/api';
import { AgentSummary } from '@/types/agent';

interface AgentState {
    agents: AgentSummary[];
    isLoading: boolean;
    error: string | null;
}

const initialState: AgentState = {
    agents: [],
    isLoading: false,
    error: null,
};

export const fetchAllAgents = createAsyncThunk(
    'agents/fetchAll',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await agentAPI.getAllAgents(token);
            return response.result;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch agents');
        }
    }
);

const agentSlice = createSlice({
    name: 'agents',
    initialState,
    reducers: {
        setAgents: (state, action: PayloadAction<AgentSummary[]>) => {
            state.agents = action.payload;
        },
        addAgentOptimistic: (state, action: PayloadAction<AgentSummary>) => {
            state.agents.unshift(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllAgents.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllAgents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.agents = action.payload;
            })
            .addCase(fetchAllAgents.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setAgents, addAgentOptimistic } = agentSlice.actions;
export default agentSlice.reducer;
