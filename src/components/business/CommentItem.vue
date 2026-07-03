<template>
    <div class="comment-item">
        <!-- 评论主体 -->
        <div class="comment-body">
            <div class="comment-header">
                <img :src="comment.avatar || defaultAvatar" alt="avatar" class="comment-avatar" />
                <span class="comment-author">{{ comment.author }}</span>
                <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
            </div>

            <p class="comment-content">{{ comment.content }}</p>

            <div class="comment-actions">
                <button class="action-btn" @click="toggleReply">回复</button>
                <button v-if="canDelete" class="action-btn delete" @click="handleDelete">
                    删除
                </button>
            </div>

            <!-- 回复输入框 -->
            <div v-if="showReply" class="reply-input">
                <textarea v-model="replyContent" placeholder="输入你的回复..." rows="2" class="reply-textarea" />
                <div class="reply-actions">
                    <button class="cancel-btn" @click="toggleReply">取消</button>
                    <button class="submit-btn" @click="submitReply">提交回复</button>
                </div>
            </div>
        </div>

        <!-- 子评论（递归） -->
        <div v-if="comment.replies && comment.replies.length > 0" class="comment-replies">
            <CommentItem v-for="reply in comment.replies" :key="reply.id" :comment="reply" :depth="depth + 1"
                @delete="handleDelete" @reply="handleReply" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useUserStore } from '@/store/modules/userStore'
import dayjs from 'dayjs'

// ============================================
// Props
// ============================================
const props = defineProps({
    comment: {
        type: Object,
        required: true,
    },
    depth: {
        type: Number,
        default: 0,
    },
})

// 显式设置组件名称
defineOptions({
    name: 'CommentItem'
})

// ============================================
// Emits
// ============================================
const emit = defineEmits(['delete', 'reply'])

// ============================================
// 注入用户信息
// ============================================
const userStore = useUserStore()
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'

// ============================================
// 状态
// ============================================
const showReply = ref(false)
const replyContent = ref('')

// ============================================
// 计算属性
// ============================================
const canDelete = computed(() => {
    // 自己的评论或管理员可以删除
    return userStore?.userInfo?.username === props.comment.author ||
        userStore?.userInfo?.role === 'admin'
})

// ============================================
// 方法
// ============================================
function formatDate(date) {
    return dayjs(date).format('YYYY-MM-DD HH:mm')
}

function toggleReply() {
    showReply.value = !showReply.value
    if (!showReply.value) {
        replyContent.value = ''
    }
}

function submitReply() {
    if (!replyContent.value.trim()) return

    emit('reply', {
        parentId: props.comment.id,
        content: replyContent.value,
    })

    replyContent.value = ''
    showReply.value = false
}

function handleDelete() {
    emit('delete', props.comment.id)
}

function handleReply(data) {
    // 向上传递
    emit('reply', data)
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.comment-item {
    padding-left: $spacing-md;
    border-left: 2px solid var(--color-border);

    &:not(:last-child) {
        margin-bottom: $spacing-md;
    }
}

.comment-body {
    padding: $spacing-md;
    background: var(--color-bg-card);
    border-radius: $radius-md;
    border: 1px solid var(--color-border);
}

.comment-header {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-sm;

    .comment-avatar {
        width: 32px;
        height: 32px;
        border-radius: $radius-full;
    }

    .comment-author {
        font-weight: 600;
        color: var(--color-text-primary);
        font-size: $font-size-sm;
    }

    .comment-time {
        font-size: $font-size-xs;
        color: var(--color-text-muted);
    }
}

.comment-content {
    color: var(--color-text-secondary);
    font-size: $font-size-sm;
    line-height: 1.6;
    margin-bottom: $spacing-sm;
}

.comment-actions {
    display: flex;
    gap: $spacing-md;

    .action-btn {
        background: transparent;
        border: none;
        color: var(--color-text-muted);
        font-size: $font-size-xs;
        cursor: pointer;
        padding: 0;

        &:hover {
            color: $color-primary;
        }

        &.delete:hover {
            color: $color-danger;
        }
    }
}

.reply-input {
    margin-top: $spacing-sm;

    .reply-textarea {
        width: 100%;
        padding: $spacing-sm;
        border: 1px solid var(--color-border);
        border-radius: $radius-sm;
        background: var(--color-bg);
        color: var(--color-text-primary);
        font-size: $font-size-sm;
        resize: vertical;
        outline: none;

        &:focus {
            border-color: $color-primary;
        }
    }

    .reply-actions {
        display: flex;
        gap: $spacing-sm;
        margin-top: $spacing-sm;

        .cancel-btn,
        .submit-btn {
            padding: $spacing-xs $spacing-md;
            border: none;
            border-radius: $radius-sm;
            font-size: $font-size-sm;
            cursor: pointer;
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

            &:hover {
                background: $color-primary-dark;
            }
        }
    }
}

.comment-replies {
    margin-top: $spacing-sm;
    margin-left: $spacing-lg;
}
</style>