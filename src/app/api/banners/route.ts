import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { writeFile } from "fs/promises"

// Путь к директории с баннерами
const bannersDirectory = path.join(process.cwd(), "public/img")

// Получить список всех баннеров
export async function GET() {
    try {
        // Проверяем, существует ли директория
        if (!fs.existsSync(bannersDirectory)) {
            fs.mkdirSync(bannersDirectory, { recursive: true })
        }

        // Получаем список файлов в директории
        const files = fs.readdirSync(bannersDirectory)

        // Фильтруем только файлы баннеров (начинающиеся с "banner")
        const bannerFiles = files
            .filter((file) => file.startsWith("banner") && /\.(jpg|jpeg|png|webp)$/i.test(file))
            .sort((a, b) => {
                // Сортируем по номеру в имени файла
                const numA = Number.parseInt(a.replace(/banner(\d+)\.\w+$/, "$1"))
                const numB = Number.parseInt(b.replace(/banner(\d+)\.\w+$/, "$1"))
                return numA - numB
            })

        // Формируем список баннеров с ID и путями
        const banners = bannerFiles.map((file) => {
            const id = Number.parseInt(file.replace(/banner(\d+)\.\w+$/, "$1"))
            return {
                id,
                path: `/img/${file}`,
                name: file,
            }
        })

        return NextResponse.json(banners)
    } catch (error) {
        console.error("Error getting banners:", error)
        return NextResponse.json({ error: "Failed to get banners" }, { status: 500 })
    }
}

// Загрузить новый баннер
export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        // Проверяем, существует ли директория
        if (!fs.existsSync(bannersDirectory)) {
            fs.mkdirSync(bannersDirectory, { recursive: true })
        }

        // Получаем список существующих баннеров
        const files = fs.readdirSync(bannersDirectory)
        const bannerFiles = files.filter((file) => file.startsWith("banner") && /\.(jpg|jpeg|png|webp)$/i.test(file))

        // Определяем следующий номер для баннера
        let nextId = 1
        if (bannerFiles.length > 0) {
            const ids = bannerFiles.map((file) => Number.parseInt(file.replace(/banner(\d+)\.\w+$/, "$1")))
            nextId = Math.max(...ids) + 1
        }

        // Определяем расширение файла
        const fileExtension = file.name.split(".").pop() || "jpg"
        const fileName = `banner${nextId}.${fileExtension}`
        const filePath = path.join(bannersDirectory, fileName)

        // Сохраняем файл
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filePath, buffer)

        return NextResponse.json({
            id: nextId,
            path: `/img/${fileName}`,
            name: fileName,
        })
    } catch (error) {
        console.error("Error uploading banner:", error)
        return NextResponse.json({ error: "Failed to upload banner" }, { status: 500 })
    }
}

