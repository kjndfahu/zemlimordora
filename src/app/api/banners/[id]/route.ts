import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const bannersDirectory = path.join(process.cwd(), "public/img")

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = Number.parseInt(params.id)

        const files = fs.readdirSync(bannersDirectory)

        const bannerFile = files.find((file) => {
            const fileId = Number.parseInt(file.replace(/banner(\d+)\.\w+$/, "$1"))
            return fileId === id
        })

        if (!bannerFile) {
            return NextResponse.json({ error: "Banner not found" }, { status: 404 })
        }

        // Удаляем файл
        const filePath = path.join(bannersDirectory, bannerFile)
        fs.unlinkSync(filePath)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting banner:", error)
        return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 })
    }
}

