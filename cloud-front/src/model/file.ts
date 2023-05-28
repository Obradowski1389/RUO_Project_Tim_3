export interface IFile {
    id: string
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

export interface FileMoveDTO {
    id: string,
    name: string
}

export function fromFileCreateDTOToIFile(file: FileCreateDTO): IFile {
    return {
        name: file.name,
        type: file.type,
        isFolder: file.isFolder,
        size: file.size,
        createDate: file.createDate,
        lastModifyDate: file.lastModifyDate,
        description: file.description,
        tags: file.tags
    } as IFile
}