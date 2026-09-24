Add-Type -AssemblyName System.Drawing

function Optimize-Jpeg($path, $maxDim, $quality) {
    if (-not (Test-Path $path)) { return }
    $img = [System.Drawing.Bitmap]::FromFile($path)
    $origW = $img.Width
    $origH = $img.Height
    
    # Calculate scale
    $scale = 1.0
    if ($origW -gt $maxDim -or $origH -gt $maxDim) {
        $scale = [Math]::Min($maxDim / $origW, $maxDim / $origH)
    }
    $newW = [int]($origW * $scale)
    $newH = [int]($origH * $scale)
    
    $newBmp = New-Object System.Drawing.Bitmap($newW, $newH, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $graphics = [System.Drawing.Graphics]::FromImage($newBmp)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $graphics.DrawImage($img, 0, 0, $newW, $newH)
    $graphics.Dispose()
    $img.Dispose()
    
    # Encoder
    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatDescription -eq "JPEG" }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)
    
    $tempPath = $path + ".tmp.jpg"
    $newBmp.Save($tempPath, $encoder, $encoderParams)
    $newBmp.Dispose()
    $encoderParams.Dispose()
    
    $origBytes = (Get-Item $path).Length
    $newBytes = (Get-Item $tempPath).Length
    Write-Host "$path : $origBytes bytes -> $newBytes bytes ($newW x $newH)"
    
    Move-Item -Path $tempPath -Destination $path -Force
}

$dir = "c:\Users\mateo\OneDrive\Documentos\TIENDA ONLINE\images"

# Hero images max 1400px width, quality 78
Optimize-Jpeg "$dir\hero1.jpg" 1400 78
Optimize-Jpeg "$dir\hero2.jpg" 1400 78
Optimize-Jpeg "$dir\hero3.jpg" 1400 78
Optimize-Jpeg "$dir\banner-editorial.jpg" 1400 78

# Category & product images max 700px width, quality 78
Optimize-Jpeg "$dir\cat-camisetas.jpg" 700 78
Optimize-Jpeg "$dir\cat-polo.jpg" 700 78
Optimize-Jpeg "$dir\cat-pantaloneta.jpg" 700 78
Optimize-Jpeg "$dir\cat-jeans.jpg" 700 78
Optimize-Jpeg "$dir\prod-oversize.jpg" 700 78
Optimize-Jpeg "$dir\prod-manga-larga.jpg" 700 78
Optimize-Jpeg "$dir\prod-jeans-slim.jpg" 700 78
Optimize-Jpeg "$dir\destacado.jpg" 700 78

# Also optimize logo to 160x160 for maximum speed (52px display)
$logoPath = "$dir\logo.png"
$img = [System.Drawing.Bitmap]::FromFile($logoPath)
$logoTarget = 160
$logoBmp = New-Object System.Drawing.Bitmap($logoTarget, $logoTarget, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($logoBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$g.DrawImage($img, 0, 0, $logoTarget, $logoTarget)
$g.Dispose()
$img.Dispose()

$tempLogo = "$dir\logo_160.png"
$logoBmp.Save($tempLogo, [System.Drawing.Imaging.ImageFormat]::Png)
$logoBmp.Dispose()
$logoOrig = (Get-Item $logoPath).Length
$logoNew = (Get-Item $tempLogo).Length
Write-Host "Logo: $logoOrig bytes -> $logoNew bytes"
Move-Item -Path $tempLogo -Destination $logoPath -Force

Write-Host "All images optimized for maximum speed!"
