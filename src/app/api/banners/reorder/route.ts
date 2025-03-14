import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Путь к директории с баннерами
const bannersDirectory = path.join(process.cwd(), "public/img")

// Изменить порядок баннеров
export async function POST(request: Request) {
    try {
        const { ids } = await request.json()

        if (!Array.isArray(ids)) {
            return NextResponse.json({ error: "Invalid IDs format" }, { status: 400 })
        }

        // Получаем список файлов в директории
        const files = fs.readdirSync(bannersDirectory)

        // Фильтруем только файлы баннеров
        const bannerFiles = files.filter((file) => file.startsWith("banner") && /\.(jpg|jpeg|png|webp)$/i.test(file))

        // Создаем временную директорию для переименования
        const tempDir = path.join(process.cwd(), "temp_banners")
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true })
        }

        // Сначала перемещаем файлы во временную директорию с временными именами
        const bannerMap = new Map()
        bannerFiles.forEach((file) => {
            const id = Number.parseInt(file.replace(/banner(\d+)\.\w+$/, "$1"))
            bannerMap.set(id, file)
        })

        // Перемещаем файлы во временную директорию
        for (const id of ids) {
            const file = bannerMap.get(id)
            if (file) {
                const oldPath = path.join(bannersDirectory, file)
                const tempPath = path.join(tempDir, `temp_${file}`)
                fs.renameSync(oldPath, tempPath)
            }
        }

        // Перемещаем файлы обратно с новыми именами
        ids.forEach((id, index) => {
            const file = bannerMap.get(id)
            if (file) {
                const extension = file.split(".").pop()
                const tempPath = path.join(tempDir, `temp_${file}`)
                const newPath = path.join(bannersDirectory, `banner${index + 1}.${extension}`)
                fs.renameSync(tempPath, newPath)
            }
        })

        // Удаляем временную директорию
        if (fs.existsSync(tempDir)) {
            fs.rmdirSync(tempDir)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error reordering banners:", error)
        return NextResponse.json({ error: "Failed to reorder banners" }, { status: 500 })
    }
}

