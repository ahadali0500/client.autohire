import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { agentAPI } from '@/lib/api';
import { AgentSummary } from '@/types/agent';

interface AgentState {
    agents: AgentSummary[];
    isLoading: boolean;
    hasFetched: boolean;
    error: string | null;
}

const initialState: AgentState = {
    agents: [],
    isLoading: false,
    hasFetched: false,
    error: null,
};

export const fetchAllAgents = createAsyncThunk(
    'agents/fetchAll',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await agentAPI.getAllAgents(token);
            return response.result || [];
        } catch (error: unknown) {
            const response = (
                error as {
                    response?: { data?: { message?: string } };
                }
            ).response;

            return rejectWithValue(response?.data?.message || 'Failed to fetch agents');
        }
    }
);

const agentSlice = createSlice({
    name: 'agents',
    initialState,
    reducers: {
        setAgents: (state, action: PayloadAction<AgentSummary[]>) => {
            state.agents = action.payload;
            state.hasFetched = true;
        },
        addAgentOptimistic: (state, action: PayloadAction<AgentSummary>) => {
            state.agents.unshift(action.payload);
            state.hasFetched = true;
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
                state.hasFetched = true;
                state.agents = action.payload;
            })
            .addCase(fetchAllAgents.rejected, (state, action) => {
                state.isLoading = false;
                state.hasFetched = true;
                state.error = action.payload as string;
            });
    },
});

export const { setAgents, addAgentOptimistic } = agentSlice.actions;
export default agentSlice.reducer;
