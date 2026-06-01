import { useState, useCallback, useRef } from "react"
import {
  getImageDimensions,
  isImageWithinLimit,
  rescaleImageToShortSide,
  MAX_IMAGE_DIMENSION,
} from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type ResolveFn = (file: File | null) => void

export function useImageSizeValidator() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [pendingDimensions, setPendingDimensions] = useState<{
    width: number
    height: number
  } | null>(null)
  const resolveRef = useRef<ResolveFn | null>(null)

  const processImageFile = useCallback(
    async (file: File): Promise<File | null> => {
      try {
        const { width, height } = await getImageDimensions(file)
        if (isImageWithinLimit(width, height)) {
          return file
        }

        return new Promise<File | null>((resolve) => {
          resolveRef.current = resolve
          setPendingFile(file)
          setPendingDimensions({ width, height })
          setDialogOpen(true)
        })
      } catch (e) {
        console.error("Error checking image dimensions:", e)
        return null
      }
    },
    []
  )

  const handleRescale = useCallback(async () => {
    const file = pendingFile
    const resolve = resolveRef.current
    if (!file || !resolve) return
    setDialogOpen(false)
    setPendingFile(null)
    setPendingDimensions(null)
    resolveRef.current = null
    try {
      const rescaled = await rescaleImageToShortSide(file, MAX_IMAGE_DIMENSION)
      resolve(rescaled)
    } catch (e) {
      console.error("Error rescaling image:", e)
      resolve(null)
    }
  }, [pendingFile])

  const handleCancel = useCallback(() => {
    const resolve = resolveRef.current
    if (resolve) {
      resolve(null)
    }
    setDialogOpen(false)
    setPendingFile(null)
    setPendingDimensions(null)
    resolveRef.current = null
  }, [])

  const RescaleDialog = (
    <AlertDialog open={dialogOpen} onOpenChange={(open) => !open && handleCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Imagen demasiado grande</AlertDialogTitle>
          <AlertDialogDescription>
            {pendingDimensions && (
              <>
                La imagen ({pendingDimensions.width}×{pendingDimensions.height}{" "}
                px) supera el límite de {MAX_IMAGE_DIMENSION}×
                {MAX_IMAGE_DIMENSION} píxeles. ¿Desea reescalarla a 512 px en el
                lado más corto manteniendo la relación de aspecto?
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleRescale}>
            Reescalar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return { processImageFile, RescaleDialog }
}

export default useImageSizeValidator
