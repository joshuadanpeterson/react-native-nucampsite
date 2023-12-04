import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../shared/baseUrl/";

export const postComment = createAsyncThunk(
	"comments/postComment",
	async (payload, { dispatch, getState }) => {
		await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate server response delay
		const { comments } = getState();

		// Adding date and id to the payload
		payload.date = new Date().toISOString();
		payload.id = comments.commentsArray.length;

		dispatch(addComment(payload));
	}
);

export const fetchComments = createAsyncThunk(
	"comments/fetchComments",
	async () => {
		const response = await fetch(baseUrl + "comments");
		if (!response.ok) {
			return Promise.reject(
				"Unable to fetch, status: " + response.status
			);
		}
		return await response.json();
	}
);

const commentsSlice = createSlice({
	name: "comments",
	initialState: { isLoading: true, errMess: null, commentsArray: [] },
	reducers: {
		addComment: (state, action) => {
			state.commentsArray.push(action.payload);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchComments.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchComments.fulfilled, (state, action) => {
				state.isLoading = false;
				state.errMess = null;
				state.commentsArray = action.payload;
			})
			.addCase(fetchComments.rejected, (state, action) => {
				state.isLoading = false;
				state.errMess = action.error
					? action.error.message
					: "Fetch failed";
			});
	},
});

export const commentsReducer = commentsSlice.reducer;
export const { addComment } = commentsSlice.actions;
