//实现自定义指令 元素权限

import { useUserStore } from '@/store/modules/userStore'
import { onMounted, onUpdated } from 'vue'


export const  vPermission = {
    mounted( el , binding){
        console.log('el',el)
        console.log('binding',binding)

        const userStore = useUserStore()
        const userRole = userStore.userInfo?.role || 'guest'

        let permissionValue = binding.value

        if(!permissionValue) return

            // 判断是否有权限
        let hasPermission = false

        if(typeof userRole === 'String'){
            hasPermission = userRole === permissionValue

        }else if(Array.isArray(userRole)){
            hasPermission = userRole.includes(permissionValue)
        }


        if(!hasPermission){
            el.style.display = 'none';
        }


    },
    updated( el , binding){
        const userStore = useUserStore()
        const userRole = userStore.userInfo?.role || 'guest'

        let permissionValue = binding.value

        if(!permissionValue) return

            // 判断是否有权限
        let hasPermission = false

        if(typeof userRole === 'String'){
            hasPermission = userRole === permissionValue

        }else if(Array.isArray(userRole)){
            hasPermission = userRole.includes(permissionValue)
        }


        if(!hasPermission){
            el.style.display = 'none';
        }
    }
}