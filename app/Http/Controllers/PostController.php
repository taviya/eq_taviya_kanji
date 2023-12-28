<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Auth;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $posts = Post::with(['user', 'comments.user', 'comments.replies.user'])->latest()->get();
            return response()->json(['data' => $posts], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error retrieving posts', 'message' => $e->getMessage()], 500);
        }
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
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $input = $request->all();
        $input['user_id'] = Auth::user()->id;
        $post = Post::create($input);
        return response()->json(['message' => 'Post created successfully', 'data' => $post], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        try {
            $this->validate($request, [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
            ]);

            $post->update($request->all());
            return response()->json(['message' => 'Post updated successfully', 'data' => $post], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error updating post', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        try {
            $post->delete();
            return response()->json(['message' => 'Post deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error deleting post', 'message' => $e->getMessage()], 500);
        }
    }
}
