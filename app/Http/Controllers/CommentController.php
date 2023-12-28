<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $comments = Comment::get();
        return response()->json(['data' => $comments], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $postId, $parentCommentId = null)
    {
        $request->validate([
            'content' => 'required',
        ]);
    
        $comment = Comment::create([
            'post_id' => $postId,
            'parent_comment_id' => $parentCommentId,
            'content' => $request->input('content'),
            'user_id' => Auth::user()->id,
        ]);

        return response()->json(['message' => 'Comment created successfully', 'data' => $comment], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comment $comment)
    {
        try {
            $this->validate($request, [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
            ]);

            $comment->update($request->all());
            return response()->json(['message' => 'Comment updated successfully', 'data' => $comment], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error updating comment', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        try {
            $comment->delete();
            return response()->json(['message' => 'Comment deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error deleting comment', 'message' => $e->getMessage()], 500);
        }
    }
}
