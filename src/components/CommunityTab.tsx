"use client";

import React, { useState } from "react";
import { useApp, CommunityPost } from "@/context/AppContext";
import { Users, ThumbsUp, MessageSquare, Plus, X, Tag, Calendar, User, Sparkles, ChevronDown } from "lucide-react";

export const CommunityTab: React.FC = () => {
  const { communityPosts, createCommunityPost, addCommentToPost } = useApp();

  // Active topic filter
  const [selectedTopic, setSelectedTopic] = useState<string>("All");

  // Selected post for thread details view
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  // New post form states
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTopic, setNewTopic] = useState<CommunityPost["topic"]>("Career Advice");
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);

  // Comment input state
  const [newCommentText, setNewCommentText] = useState("");

  // Upvotes state (local tracking to allow toggle)
  const [upvotedPostIds, setUpvotedPostIds] = useState<string[]>([]);

  const topics = ["All", "Career Advice", "Technical Skills", "Interview Prep", "Show & Tell"];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    createCommunityPost(newTitle.trim(), newContent.trim(), newTopic);
    setNewTitle("");
    setNewContent("");
    setNewTopic("Career Advice");
    setShowAddPostModal(false);
  };

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newCommentText.trim()) return;

    addCommentToPost(selectedPost.id, newCommentText.trim());
    
    // Update the local modal view state immediately
    const updatedComments = [
      ...selectedPost.comments,
      { author: "Alex Mercer", text: newCommentText.trim(), date: new Date().toISOString().split("T")[0] }
    ];
    setSelectedPost({
      ...selectedPost,
      comments: updatedComments
    });
    setNewCommentText("");
  };

  const handleUpvoteToggle = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation(); // Avoid opening the details modal
    if (upvotedPostIds.includes(postId)) {
      setUpvotedPostIds(prev => prev.filter(id => id !== postId));
    } else {
      setUpvotedPostIds(prev => [...prev, postId]);
    }
  };

  // Filter posts based on selected topic
  const filteredPosts = communityPosts.filter(
    post => selectedTopic === "All" || post.topic === selectedTopic
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-purple-600/10 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-xl text-xs font-bold mb-1">
          <Users className="w-3.5 h-3.5" />
          PEET Community Forum
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Discuss & <span className="text-gradient">Share Advice</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Connect with other candidates, share tips, review interviews, and grow together.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Topics */}
        <div className="space-y-3">
          <div className="glass-panel rounded-3xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-zinc-700 dark:text-zinc-200">Browse Topics</h3>
            </div>
            
            <div className="flex flex-col gap-1">
              {topics.map((topic) => {
                const isActive = selectedTopic === topic;
                return (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-purple-600/10 text-purple-600 dark:text-purple-300 border border-purple-500/10"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowAddPostModal(true)}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold transition-colors shadow-md shadow-purple-500/15 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Write New Post
            </button>
          </div>
        </div>

        {/* Discussions List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-base font-bold text-zinc-400">
              Active Discussions ({filteredPosts.length})
            </h2>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="glass-panel rounded-3xl p-16 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto text-zinc-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">No posts in this topic</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs mx-auto">
                  Be the first to share career advice or ask a technical question under this topic category!
                </p>
              </div>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isUpvoted = upvotedPostIds.includes(post.id);
              const upvoteCount = post.upvotes + (isUpvoted ? 1 : 0);

              return (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="glass-panel rounded-2xl p-5 hover:translate-x-1 duration-200 cursor-pointer border border-purple-500/5 hover:border-purple-500/15 relative group space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-purple-600/10 text-purple-600 dark:text-purple-300 border border-purple-500/10 rounded">
                        {post.topic}
                      </span>
                      <span className="text-[10px] text-zinc-500 flex items-center gap-0.5">
                        <User className="w-3 h-3" />
                        {post.author}
                      </span>
                      <span className="text-[10px] text-zinc-500">•</span>
                      <span className="text-[10px] text-zinc-500 flex items-center gap-0.5">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-zinc-800 dark:text-zinc-150 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-sm text-zinc-550 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Actions & Metrics */}
                  <div className="flex gap-4 pt-3 border-t border-purple-500/5 text-xs font-semibold text-zinc-500">
                    <button
                      onClick={(e) => handleUpvoteToggle(e, post.id)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all ${
                        isUpvoted
                          ? "bg-purple-600/10 border-purple-600 text-purple-600 dark:text-purple-300"
                          : "border-purple-500/5 hover:text-white"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{upvoteCount} Upvotes</span>
                    </button>

                    <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-purple-500/5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.comments.length} Comments</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Write New Post Modal */}
      {showAddPostModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 max-h-[90vh] flex flex-col animate-scale-up">
            {/* Header */}
            <div className="p-5 border-b border-purple-500/10 flex justify-between items-center">
              <h3 className="font-extrabold text-base text-zinc-800 dark:text-zinc-100">Create Discussion Post</h3>
              <button
                onClick={() => setShowAddPostModal(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreatePost} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 block mb-1">Post Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tips for passing Meta's frontend system design interview"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 text-xs"
                />
              </div>

              <div className="space-y-2 relative">
                <label className="text-[10px] font-bold text-zinc-400 block mb-1">Select Topic</label>
                <button
                  type="button"
                  onClick={() => setIsTopicDropdownOpen(!isTopicDropdownOpen)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 text-xs text-left flex items-center justify-between text-zinc-700 dark:text-zinc-300 transition-all select-none cursor-pointer"
                >
                  <span>{newTopic}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isTopicDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {isTopicDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsTopicDropdownOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1 z-40 max-h-40 overflow-y-auto glass-panel rounded-xl p-1.5 border border-purple-500/20 shadow-xl scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                      {(["Career Advice", "Technical Skills", "Interview Prep", "Show & Tell"] as const).map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => {
                            setNewTopic(topic);
                            setIsTopicDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                            newTopic === topic
                              ? "bg-purple-650 text-white"
                              : "text-zinc-455 hover:text-zinc-200 hover:bg-purple-500/10"
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 block mb-1">Content Body</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Write your explanation or query here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPostModal(false)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-xs font-bold rounded-xl text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Details & Thread Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 max-h-[90vh] flex flex-col animate-scale-up">
            
            {/* Header */}
            <div className="p-6 border-b border-purple-500/10 flex justify-between items-start gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-purple-600/10 text-purple-600 dark:text-purple-300 border border-purple-500/10 rounded">
                    {selectedPost.topic}
                  </span>
                  <span className="text-xs text-zinc-400">by {selectedPost.author}</span>
                </div>
                <h3 className="font-extrabold text-lg sm:text-xl text-zinc-800 dark:text-zinc-100 leading-snug">
                  {selectedPost.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-850"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable thread */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Core Post Content */}
              <div className="p-4 rounded-2xl bg-purple-600/5 border border-purple-500/10 leading-relaxed text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                {selectedPost.content}
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Comments ({selectedPost.comments.length})
                </h4>

                <div className="space-y-3">
                  {selectedPost.comments.length === 0 ? (
                    <div className="text-xs text-zinc-500 italic p-3 text-center">
                      No replies yet. Start the conversation!
                    </div>
                  ) : (
                    selectedPost.comments.map((comment, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-purple-500/5 space-y-1.5"
                      >
                        <div className="flex justify-between text-[10px] text-zinc-500 font-bold">
                          <span>{comment.author}</span>
                          <span>{comment.date}</span>
                        </div>
                        <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Post Comment Form */}
              <form onSubmit={handleAddCommentSubmit} className="pt-4 border-t border-purple-500/10 space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 block mb-1">Write a Reply</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Type your comment reply..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600 resize-none font-sans"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPost(null)}
                    className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-xs font-bold rounded-xl text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                  >
                    Back to Forum
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20"
                  >
                    Post Reply
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
