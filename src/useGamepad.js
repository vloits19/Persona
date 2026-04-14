import { useEffect, useRef } from "react";

export function useGamepad(callback) {
  const savedCallback = useRef(callback);
  // Mulai lastState dengan null untuk menangani "First Frame"
  const lastState = useRef(null);

  // Selalu simpan fungsi callback terbaru tanpa mereset requestAnimationFrame
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    let animationFrameId;

    const checkGamepad = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      let input = null;

      for (let i = 0; i < gamepads.length; i++) {
        const gp = gamepads[i];
        if (!gp) continue;

        // DPAD (12=Atas, 13=Bawah, 14=Kiri, 15=Kanan) atau Analog Kiri (Axes 0 dan 1)
        const up = gp.buttons[12]?.pressed || gp.axes[1] < -0.5;
        const down = gp.buttons[13]?.pressed || gp.axes[1] > 0.5;
        const left = gp.buttons[14]?.pressed || gp.axes[0] < -0.5;
        const right = gp.buttons[15]?.pressed || gp.axes[0] > 0.5;
        
        // Tombol Aksi: A (Xbox) / Cross (PlayStation) = index 0 / B (Xbox) / Circle (PlayStation) = index 1
        const enter = gp.buttons[0]?.pressed;
        const escape = gp.buttons[1]?.pressed || gp.buttons[2]?.pressed; // B/Circle atau X/Square
        
        // Tombol Bahu (LB / L1 dan RB / R1)
        const lb = gp.buttons[4]?.pressed;
        const rb = gp.buttons[5]?.pressed;

        const currentState = { up, down, left, right, enter, escape, lb, rb };

        // FIRST FRAME: Catat status awal tombol tanpa langsung mengeksekusi jika ditahan dari menu sebelumnya
        if (!lastState.current) {
          lastState.current = currentState;
          break; // Stop loop and wait for next frame
        }

        // Mendeteksi tombol baru yang ditekan agar tidak berulang kali trigger sat ditahan
        if (up && !lastState.current.up) input = "ArrowUp";
        if (down && !lastState.current.down) input = "ArrowDown";
        if (left && !lastState.current.left) input = "ArrowLeft";
        if (right && !lastState.current.right) input = "ArrowRight";
        
        // LB dan RB khusus
        if (lb && !lastState.current.lb) input = "LB";
        if (rb && !lastState.current.rb) input = "RB";
        
        // A/Cross = Enter (Pilih), B/Circle = Escape (Kembali)
        if (enter && !lastState.current.enter) input = "Enter";
        if (escape && !lastState.current.escape) input = "Escape";

        // Simpan state saat ini
        lastState.current = currentState;

        if (input) {
          savedCallback.current({ key: input });
          break; // Proses input pertama yang terdeteksi
        }
      }

      animationFrameId = requestAnimationFrame(checkGamepad);
    };

    animationFrameId = requestAnimationFrame(checkGamepad);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
}
