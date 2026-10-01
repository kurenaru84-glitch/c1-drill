/** Cloud TTS 失敗時は端末読み上げに切り替え（設定エラーのトーストは出さない） */
export async function playWithTtsFallback(
  playCloud: () => Promise<unknown>,
  playDevice: () => void
): Promise<void> {
  try {
    await playCloud();
  } catch {
    playDevice();
  }
}
