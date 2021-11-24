import { promises as fs } from 'fs'
import { basename, extname } from 'path'

type Dirent = {
  isFile(): boolean
  isDirectory(): boolean
  isBlockDevice(): boolean
  isCharacterDevice(): boolean
  isSymbolicLink(): boolean
  isFIFO(): boolean
  isSocket(): boolean
  name: string
}

export type FileFormat = {
  /** Whether this is a file or directory type. */
  type: 'directory' | 'file'

  /** The file extension if it exists. */
  extension: string | null

  /** Any associated files in a directory type. */
  children: any[]

  /** Name of the file. */
  name: string

  /** Absolute path to the file. */
  path: string

  /** Files returned from fs.readdir(path, { withFileTypes: true }). */
  files: Dirent[]

  /** The current level we're operating on with -1 being the root. */
  level: number
}

/**
 * Starting at a root directory, recursively walk every file and its sub-directories.
 */
export async function getFiles(
  /** Path to the root directory. */
  path: string,
  /** Format for the current file or directory. Returning `null` will stop traversal. */
  format: (fileFormat: FileFormat) => any,
  _level = -1,
  _isDirectory = true
) {
  const extension = extname(path).slice(1)
  const name = basename(path, `.${extension}`)
  let files = []
  let children = []
  if (_isDirectory) {
    files = await fs.readdir(path, { withFileTypes: true })
    children = await Promise.all(
      files.map((file) =>
        getFiles(`${path}/${file.name}`, format, _level + 1, file.isDirectory())
      )
    )
  }
  return format({
    type: _isDirectory ? 'directory' : 'file',
    level: _level,
    extension: extension === '' ? null : extension,
    files: files.filter(Boolean),
    children: children.filter(Boolean),
    name,
    path,
  })
}
