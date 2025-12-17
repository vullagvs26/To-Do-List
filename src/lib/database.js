import { supabase } from './supabase'

// ============= TODOS =============
export const todoService = {
  async getTodos(userId) {
    const { data, error } = await supabase
      .from('todos')
      .select('*, todo_tags(tag_id)')
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async createTodo(userId, todo) {
    const { data, error } = await supabase
      .from('todos')
      .insert([{ ...todo, user_id: userId }])
      .select()
    if (error) throw error
    return data[0]
  },

  async updateTodo(todoId, updates) {
    const { data, error } = await supabase
      .from('todos')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', todoId)
      .select()
    if (error) throw error
    return data[0]
  },

  async deleteTodo(todoId) {
    const { error } = await supabase
      .from('todos')
      .update({ is_deleted: true })
      .eq('id', todoId)
    if (error) throw error
  },

  async addTagToTodo(todoId, tagId) {
    const { error } = await supabase
      .from('todo_tags')
      .insert([{ todo_id: todoId, tag_id: tagId }])
    if (error) throw error
  },

  async removeTagFromTodo(todoId, tagId) {
    const { error } = await supabase
      .from('todo_tags')
      .delete()
      .eq('todo_id', todoId)
      .eq('tag_id', tagId)
    if (error) throw error
  },
}

// ============= TAGS =============
export const tagService = {
  async getTags(userId) {
    const { data, error } = await supabase
      .from('tags')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async createTag(userId, name) {
    const { data, error } = await supabase
      .from('tags')
      .insert([{ user_id: userId, name }])
      .select()
    if (error) throw error
    return data[0]
  },

  async updateTag(tagId, name) {
    const { data, error } = await supabase
      .from('tags')
      .update({ name })
      .eq('id', tagId)
      .select()
    if (error) throw error
    return data[0]
  },

  async deleteTag(tagId) {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', tagId)
    if (error) throw error
  },
}

// ============= PROFILES =============
export const profileService = {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('id', userId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert([{ id: userId, ...updates }])
      .select()
    if (error) throw error
    return data[0]
  },

  async createProfile(userId, username) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ id: userId, username }])
      .select()
    if (error) throw error
    return data[0]
  },
}
