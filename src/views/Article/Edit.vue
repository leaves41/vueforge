<template>
    <div class="article-edit">
      <h1>{{ isEdit ? '编辑文章' : '发布文章' }}</h1>
      
      <form @submit.prevent="handleSubmit" class="edit-form">
        <!-- 标题 -->
        <div class="form-group">
          <label>标题 *</label>
          <input
            v-model.trim="form.title"
            type="text"
            placeholder="请输入文章标题"
            class="form-input"
            required
          />
        </div>
        
        <!-- 分类 -->
        <div class="form-group">
          <label>分类 *</label>
          <select v-model="form.category" class="form-select" required>
            <option value="">请选择分类</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
        
        <!-- 摘要 -->
        <div class="form-group">
          <label>摘要</label>
          <textarea
            v-model="form.summary"
            placeholder="请输入文章摘要（选填）"
            rows="3"
            class="form-textarea"
          />
        </div>
        
        <!-- 内容 -->
        <div class="form-group">
          <label>内容 *</label>
          <textarea
            v-model="form.content"
            placeholder="请输入文章内容（支持 Markdown）"
            rows="10"
            class="form-textarea"
            required
          />
        </div>
        
        <!-- 标签 -->
        <div class="form-group">
          <label>标签</label>
          <div class="tag-input">
            <input
              v-model="tagInput"
              placeholder="输入标签后按回车添加"
              class="form-input"
              @keyup.enter="addTag"
            />
            <div v-if="form.tags.length > 0" class="tag-list">
              <span v-for="tag in form.tags" :key="tag" class="tag-item">
                #{{ tag }}
                <span class="tag-remove" @click="removeTag(tag)">✕</span>
              </span>
            </div>
          </div>
        </div>
        
        <!-- 发布状态 -->
        <div class="form-group">
          <label>
            <input v-model="form.isPublished" type="checkbox" />
            立即发布
          </label>
        </div>
        
        <!-- 提交按钮 -->
        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="goBack">取消</button>
          <button type="submit" class="submit-btn" :disabled="submitting">
            {{ submitting ? '提交中...' : (isEdit ? '更新' : '发布') }}
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useArticles } from '@/composables/useArticles'
  import request from '@/api/request'
  
  const route = useRoute()
  const router = useRouter()
  const { fetchArticle, createArticle, updateArticle } = useArticles()
  
  // ============================================
  // 状态
  // ============================================
  const isEdit = computed(() => !!route.params.id)
  const categories = ref(['Vue', 'React', 'CSS', 'JavaScript', '工程化', '算法'])
  const tagInput = ref('')
  const submitting = ref(false)
  
  // ============================================
  // 表单数据
  // ============================================
  const form = reactive({
    title: '',
    category: '',
    summary: '',
    content: '',
    tags: [],
    isPublished: true,
  })
  
  // ============================================
  // 方法
  // ============================================
  function addTag() {
    const tag = tagInput.value.trim()
    if (tag && !form.tags.includes(tag)) {
      form.tags.push(tag)
      tagInput.value = ''
    }
  }
  
  function removeTag(tag) {
    form.tags = form.tags.filter(t => t !== tag)
  }
  
  async function handleSubmit() {
    if (!form.title.trim() || !form.category || !form.content.trim()) {
      alert('请填写完整信息')
      return
    }
    
    submitting.value = true
    try {
      if (isEdit.value) {
        await updateArticle(route.params.id, form)
        alert('文章更新成功！')
      } else {
        await createArticle(form)
        alert('文章发布成功！')
      }
      router.push('/')
    } catch (error) {
      console.error('提交失败:', error)
      alert('提交失败，请重试')
    } finally {
      submitting.value = false
    }
  }
  
  async function loadArticle() {
    if (!isEdit.value) return
    try {
      const data = await fetchArticle(route.params.id)
      Object.assign(form, data)
    } catch (error) {
      console.error('加载文章失败:', error)
    }
  }
  
  function goBack() {
    router.back()
  }
  
  // ============================================
  // 生命周期
  // ============================================
  onMounted(() => {
    loadArticle()
  })
  </script>
  
  <style lang="scss" scoped>
  @import '@/assets/styles/variables.scss';
  
  .article-edit {
    max-width: 800px;
    margin: 0 auto;
    padding: $spacing-xl 0;
    
    h1 {
      font-size: $font-size-2xl;
      margin-bottom: $spacing-xl;
    }
  }
  
  .edit-form {
    background: var(--color-bg-card);
    border-radius: $radius-lg;
    border: 1px solid var(--color-border);
    padding: $spacing-xl;
  }
  
  .form-group {
    margin-bottom: $spacing-lg;
    
    label {
      display: block;
      font-weight: 500;
      color: var(--color-text-primary);
      margin-bottom: $spacing-sm;
    }
  }
  
  .form-input,
  .form-select,
  .form-textarea {
    width: 100%;
    padding: $spacing-sm $spacing-md;
    border: 1px solid var(--color-border);
    border-radius: $radius-md;
    background: var(--color-bg);
    color: var(--color-text-primary);
    font-size: $font-size-sm;
    outline: none;
    transition: border-color $transition-fast;
    
    &:focus {
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
    }
  }
  
  .form-textarea {
    resize: vertical;
  }
  
  .tag-input {
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-sm;
      margin-top: $spacing-sm;
      
      .tag-item {
        display: inline-flex;
        align-items: center;
        gap: $spacing-xs;
        padding: 2px $spacing-sm;
        background: rgba($color-primary, 0.1);
        color: $color-primary;
        border-radius: $radius-sm;
        font-size: $font-size-sm;
        
        .tag-remove {
          cursor: pointer;
          font-size: $font-size-xs;
          
          &:hover {
            color: $color-danger;
          }
        }
      }
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-md;
    margin-top: $spacing-lg;
    padding-top: $spacing-lg;
    border-top: 1px solid var(--color-border);
    
    .cancel-btn,
    .submit-btn {
      padding: $spacing-sm $spacing-xl;
      border: none;
      border-radius: $radius-md;
      font-size: $font-size-sm;
      cursor: pointer;
      transition: all $transition-fast;
    }
    
    .cancel-btn {
      background: var(--color-bg-hover);
      color: var(--color-text-secondary);
      
      &:hover {
        background: var(--color-border);
      }
    }
    
    .submit-btn {
      background: $color-primary;
      color: #fff;
      
      &:hover:not(:disabled) {
        background: $color-primary-dark;
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
  </style>