/**
 * User Management System - Node.js Demo Script
 * A sample script with ample variables for debugging demonstration
 * 
 */

const fs = require('fs');
const path = require('path');

// ============================================
// Data Models
// ============================================

class User {
  constructor(userId, username, email, role) {
    this.userId = userId;
    this.username = username;
    this.email = email;
    this.role = role;
    this.isActive = true;
    this.createdAt = new Date();
    this.lastLogin = null;
    this.profile = {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    };
    this.preferences = {
      theme: 'light',
      language: 'en',
      notifications: true,
      newsletter: false,
      twoFactorEnabled: false
    };
    this.stats = {
      loginCount: 0,
      postsCount: 0,
      commentsCount: 0,
      likesReceived: 0
    };
    this.tags = [];
    this.permissions = [];
  }
}

class Post {
  constructor(postId, author, title, content) {
    this.postId = postId;
    this.author = author;
    this.title = title;
    this.content = content;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.isPublished = false;
    this.isFeatured = false;
    this.views = 0;
    this.likes = 0;
    this.comments = [];
    this.tags = [];
    this.category = 'general';
    this.metadata = {
      wordCount: 0,
      readingTime: 0,
      difficulty: 'beginner'
    };
  }
}

class Comment {
  constructor(commentId, author, post, content) {
    this.commentId = commentId;
    this.author = author;
    this.post = post;
    this.content = content;
    this.createdAt = new Date();
    this.isEdited = false;
    this.isApproved = true;
    this.likes = 0;
    this.replies = [];
  }
}

// ============================================
// Utility Functions
// ============================================

function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function generateUserId() {
  return 'USER-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function generatePostId() {
  return 'POST-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function calculateUserScore(user) {
  const loginWeight = 10;
  const postWeight = 25;
  const commentWeight = 5;
  const likeWeight = 2;

  const loginScore = user.stats.loginCount * loginWeight;
  const postScore = user.stats.postsCount * postWeight;
  const commentScore = user.stats.commentsCount * commentWeight;
  const likeScore = user.stats.likesReceived * likeWeight;

  return loginScore + postScore + commentScore + likeScore;
}

function getPermissionLevel(role) {
  const rolePermissions = {
    'admin': ['read', 'write', 'delete', 'manage_users', 'manage_content', 'settings'],
    'moderator': ['read', 'write', 'delete', 'manage_content'],
    'editor': ['read', 'write', 'edit_own', 'publish'],
    'author': ['read', 'write', 'edit_own'],
    'contributor': ['read', 'write_draft'],
    'subscriber': ['read', 'comment'],
    'guest': ['read']
  };

  return rolePermissions[role] || [];
}

function filterContentByRole(user, content) {
  const permissions = getPermissionLevel(user.role);

  if (permissions.includes('manage_content')) {
    return content;
  }

  if (permissions.includes('delete')) {
    return content.filter(c => !c.isDeleted);
  }

  return content.filter(c => c.isPublished);
}

// ============================================
// Main Business Logic
// ============================================

function registerUser(users, username, email, role, profileData) {
  // Validation
  if (!username || username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' };
  }

  if (!validateEmail(email)) {
    return { success: false, error: 'Invalid email format' };
  }

  const emailExists = users.some(u => u.email === email);
  if (emailExists) {
    return { success: false, error: 'Email already registered' };
  }

  // Create user
  const userId = generateUserId();
  const user = new User(userId, username, email, role);

  // Apply profile data
  if (profileData) {
    user.profile.firstName = profileData.firstName || '';
    user.profile.lastName = profileData.lastName || '';
    user.profile.phone = profileData.phone || '';
    user.profile.address = profileData.address || '';
    user.profile.city = profileData.city || '';
    user.profile.state = profileData.state || '';
    user.profile.zipCode = profileData.zipCode || '';
  }

  // Assign permissions based on role
  user.permissions = getPermissionLevel(user.role);

  users.push(user);

  return { success: true, user };
}

function createPost(users, posts, authorId, title, content, category, tags) {
  const author = users.find(u => u.userId === authorId);

  if (!author) {
    return { success: false, error: 'Author not found' };
  }

  if (!author.isActive) {
    return { success: false, error: 'User account is not active' };
  }

  const permissions = getPermissionLevel(author.role);
  if (!permissions.includes('write')) {
    return { success: false, error: 'User does not have write permission' };
  }

  const postId = generatePostId();
  const post = new Post(postId, author, title, content);

  post.category = category || 'general';
  post.tags = tags || [];
  post.metadata.wordCount = content.split(/\s+/).length;
  post.metadata.readingTime = calculateReadingTime(content);

  // Auto-publish for higher roles
  if (permissions.includes('publish')) {
    post.isPublished = true;
  }

  posts.push(post);

  // Update author stats
  author.stats.postsCount++;

  return { success: true, post };
}

function publishPost(posts, postId, author) {
  const post = posts.find(p => p.postId === postId);

  if (!post) {
    return { success: false, error: 'Post not found' };
  }

  if (post.author.userId !== author.userId) {
    const permissions = getPermissionLevel(author.role);
    if (!permissions.includes('publish')) {
      return { success: false, error: 'Not authorized to publish this post' };
    }
  }

  post.isPublished = true;
  post.updatedAt = new Date();

  return { success: true, post };
}

function addComment(posts, comments, postId, authorId, content) {
  const post = posts.find(p => p.postId === postId);
  const author = comments.find(c => c.authorId === authorId) || { userId: authorId, username: 'Unknown' };

  if (!post) {
    return { success: false, error: 'Post not found' };
  }

  const commentId = 'CMT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const comment = new Comment(commentId, author, post, content);

  post.comments.push(comment);

  // Update author stats
  const commentAuthor = users.find(u => u.userId === authorId);
  if (commentAuthor) {
    commentAuthor.stats.commentsCount++;
  }

  return { success: true, comment };
}

function likePost(posts, users, postId, userId) {
  const post = posts.find(p => p.postId === postId);
  const user = users.find(u => u.userId === userId);

  if (!post) {
    return { success: false, error: 'Post not found' };
  }

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  post.likes++;
  post.author.stats.likesReceived++;

  return { success: true, likes: post.likes };
}

function getUserDashboard(user, posts, comments) {
  const userPosts = posts.filter(p => p.author.userId === user.userId);
  const userComments = comments.filter(c => c.author.userId === user.userId);

  const publishedPosts = userPosts.filter(p => p.isPublished);
  const draftPosts = userPosts.filter(p => !p.isPublished);

  const totalViews = userPosts.reduce((sum, p) => sum + p.views, 0);
  const totalLikes = userPosts.reduce((sum, p) => sum + p.likes, 0);

  const score = calculateUserScore(user);

  return {
    user: {
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.role,
      score: score,
      permissions: user.permissions
    },
    posts: {
      total: userPosts.length,
      published: publishedPosts.length,
      drafts: draftPosts.length,
      totalViews: totalViews,
      totalLikes: totalLikes
    },
    engagement: {
      comments: userComments.length,
      averageLikesPerPost: userPosts.length > 0 ? totalLikes / userPosts.length : 0
    }
  };
}

// ============================================
// Main Execution
// ============================================

function main() {
  console.log('='.repeat(60));
  console.log('USER MANAGEMENT SYSTEM - NODE.JS DEMO');
  console.log('='.repeat(60));

  const users = [];
  const posts = [];
  const comments = [];

  // Register sample users
  console.log('\n--- Registering Users ---');

  const userResults = [
    registerUser(users, 'alice_admin', 'alice@example.com', 'admin', {
      firstName: 'Alice',
      lastName: 'Johnson',
      phone: '555-0101',
      address: '123 Admin St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    }),
    registerUser(users, 'bob_moderator', 'bob@example.com', 'moderator', {
      firstName: 'Bob',
      lastName: 'Smith',
      phone: '555-0102',
      address: '456 Mod Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    }),
    registerUser(users, 'carol_author', 'carol@example.com', 'author', {
      firstName: 'Carol',
      lastName: 'Williams',
      phone: '555-0103',
      address: '789 Writer Rd',
      city: 'Austin',
      state: 'TX',
      zipCode: '73301'
    }),
    registerUser(users, 'dave_subscriber', 'dave@example.com', 'subscriber', {
      firstName: 'Dave',
      lastName: 'Brown',
      phone: '555-0104',
      address: '321 Reader Ln',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101'
    })
  ];

  userResults.forEach(result => {
    if (result.success) {
      console.log(`Registered: ${result.user.username} (${result.user.role})`);
    } else {
      console.log(`Error: ${result.error}`);
    }
  });

  // Simulate user logins
  users.forEach(user => {
    user.lastLogin = new Date();
    user.stats.loginCount++;
  });

  // Create sample posts
  console.log('\n--- Creating Posts ---');

  const postResults = [
    createPost(users, posts, users[0].userId,
      'Getting Started with Python Debugging',
      'Python debugging is an essential skill for developers. In this comprehensive guide, we will explore various debugging techniques including print statements, logging, breakpoints, and using IDE debuggers. We will also look at common Python debugging tools like pdb, PyCharm, and VS Code debugging features.',
      'tutorial', ['python', 'debugging', 'tutorial']),

    createPost(users, posts, users[2].userId,
      'Mastering Node.js Performance',
      'Node.js performance optimization is crucial for building scalable applications. This article covers topics like event loop optimization, memory management, clustering, and caching strategies. Learn how to identify performance bottlenecks and implement effective solutions.',
      'performance', ['nodejs', 'performance', 'optimization']),

    createPost(users, posts, users[2].userId,
      'JavaScript Async/Await Best Practices',
      'Asynchronous programming in JavaScript has evolved significantly. This post explores the best practices for using async/await, error handling, promise chaining, and concurrent execution patterns. We will also discuss common pitfalls and how to avoid them.',
      'guide', ['javascript', 'async', 'best-practices']),

    createPost(users, posts, users[0].userId,
      'Docker Container Management Tips',
      'Docker has revolutionized application deployment. This guide provides essential tips for managing Docker containers, including image optimization, networking, volume management, and orchestration with Docker Compose and Kubernetes.',
      'devops', ['docker', 'containers', 'devops'])
  ];

  postResults.forEach(result => {
    if (result.success) {
      console.log(`Created: "${result.post.title}" by ${result.post.author.username}`);
      console.log(`  - Published: ${result.post.isPublished}`);
      console.log(`  - Reading time: ${result.post.metadata.readingTime} min`);
    } else {
      console.log(`Error: ${result.error}`);
    }
  });

  // Publish posts
  console.log('\n--- Publishing Posts ---');

  posts.forEach(post => {
    const publishResult = publishPost(posts, post.postId, users[0]);
    if (publishResult.success) {
      console.log(`Published: ${post.title}`);
    }
  });

  // Add likes to posts
  console.log('\n--- Adding Interactions ---');

  posts.forEach(post => {
    likePost(posts, users, post.postId, users[1].userId);
    likePost(posts, users, post.postId, users[2].userId);
    likePost(posts, users, post.postId, users[3].userId);
    console.log(`Post "${post.title}" has ${post.likes} likes`);
  });

  // Get dashboards
  console.log('\n--- User Dashboards ---');

  users.forEach(user => {
    const dashboard = getUserDashboard(user, posts, comments);
    console.log(`\n${user.username} (${user.role}):`);
    console.log(`  Score: ${dashboard.user.score}`);
    console.log(`  Posts: ${dashboard.posts.total} (${dashboard.posts.published} published)`);
    console.log(`  Total Views: ${dashboard.posts.totalViews}`);
    console.log(`  Total Likes: ${dashboard.posts.totalLikes}`);
    console.log(`  Permissions: ${dashboard.user.permissions.join(', ')}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('ALL OPERATIONS COMPLETED SUCCESSFULLY');
  console.log('='.repeat(60));

  return {
    totalUsers: users.length,
    totalPosts: posts.length,
    totalComments: comments.length,
    publishedPosts: posts.filter(p => p.isPublished).length
  };
}

// Run the main function
const summary = main();
console.log('\nSummary:', summary);

module.exports = { User, Post, Comment, registerUser, createPost };
