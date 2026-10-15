// Reads the size of a WebP file from its RIFF header without decoding it, so the
// validator needs no image library. Returns null for anything that is not a
// complete, still (non-animated) WebP image.

const readHeader = (buffer, fileSize) => {
    if (buffer.length < 30) return null;
    if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') return null;
    if (buffer.readUInt32LE(4) + 8 !== fileSize) return null;
    const chunk = buffer.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') {
        if (buffer[23] !== 0x9d || buffer[24] !== 0x01 || buffer[25] !== 0x2a) return null;
        return { format: 'lossy', width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
    }
    if (chunk === 'VP8L') {
        if (buffer[20] !== 0x2f) return null;
        const [b0, b1, b2, b3] = [buffer[21], buffer[22], buffer[23], buffer[24]];
        return {
            format: 'lossless',
            width: 1 + (b0 | ((b1 & 0x3f) << 8)),
            height: 1 + ((b1 >> 6) | (b2 << 2) | ((b3 & 0x0f) << 10)),
        };
    }
    if (chunk === 'VP8X') {
        if (buffer[20] & 0x02) return { format: 'animated', width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
        return { format: 'extended', width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
    }
    return null;
};

/** `{ format, width, height }` of a WebP buffer, or null. `fileSize` defaults to the buffer length. */
function webpInfo(buffer, fileSize = buffer.length) {
    const info = readHeader(buffer, fileSize);
    if (!info || info.format === 'animated' || !(info.width > 0) || !(info.height > 0)) return null;
    return info;
}

module.exports = { webpInfo };
