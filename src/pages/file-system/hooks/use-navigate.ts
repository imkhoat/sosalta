import { encodeURI, decode } from 'js-base64'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { FILE_SYSTEM_ROUTE_NAMES } from 'src/core/router/routes'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { RootDirType } from 'src/core/types/root-dir-types'

export function useNavigate() {
  const router = useRouter()
  const route = useRoute()
  const { setRootDirType } = useFileSystemStore()
  const { getRootDirType } = storeToRefs(useFileSystemStore())

  function generateFileSystemRoutePath(
    parentId: string,
    rootDirType: RootDirType | undefined
  ) {
    const query = {
      parentId,
      rootDirType,
    }

    return encodeURI(JSON.stringify(query))
  }

  function exactFileSystemRoutePath(path: string) {
    const exactCode = decode(path)
    if (exactCode) {
      return JSON.parse(exactCode) as {
        parentId: string
        rootDirType: RootDirType
      }
    }
    return {
      parentId: '-----------',
      rootDirType: undefined,
    }
  }

  function handleNavigateFileSystem(
    rootDirType: RootDirType | undefined,
    parentId: string
  ) {
    if (!rootDirType) {
      throw new Error('Get roottype fail')
    }
    setRootDirType(rootDirType)
    const path = generateFileSystemRoutePath(parentId, getRootDirType.value)

    router.push({
      name: route.name || FILE_SYSTEM_ROUTE_NAMES.ENTRIES,
      params: { ...route.params },
      query: { path },
    })
  }

  return {
    generateFileSystemRoutePath,
    exactFileSystemRoutePath,
    handleNavigateFileSystem,
  }
}
