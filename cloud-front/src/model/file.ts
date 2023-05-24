export interface IFile {
    name: string
    type: string
    isFolder: boolean
    size: number
    createDate: Date
    lastModifyDate: Date
    description: string
    tags: string[]
}

export interface FileCreateDTO {
    name: string
    type: string | null
    isFolder: boolean
    size: number
    createDate: Date | null
    lastModifyDate: Date | null
    description: string | null
    tags: string[]
    file: string | null
}