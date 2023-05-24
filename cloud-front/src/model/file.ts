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
    type: string
    isFolder: boolean
    size: number
    createDate: Date
    lastModifyDate: Date
    description: string
    tags: string[]
    file: string
}