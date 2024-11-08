import tkinter as tk
from tkinter import scrolledtext, messagebox
import pyautogui
import time
import random
import threading

class TypingEmulator:
    def __init__(self, root):
        self.root = root
        self.root.title("Human Typing Emulator")
        self.is_typing = False
        self.typing_thread = None

        # Define typing speed presets
        self.presets = {
            "Slow": (0.2, 0.4),
            "Medium": (0.1, 0.3),
            "Human Paced": (0.05, 0.2)
        }

        # Set default preset
        self.selected_preset = tk.StringVar(value="Human Paced")

        # Create and place all GUI components
        self.create_widgets()

    def create_widgets(self):
        # Frame for text input
        text_frame = tk.Frame(self.root)
        text_frame.pack(padx=10, pady=5, fill=tk.BOTH, expand=True)

        text_label = tk.Label(text_frame, text="Text to Type:")
        text_label.pack(anchor='w')

        self.text_box = scrolledtext.ScrolledText(text_frame, wrap=tk.WORD, width=60, height=15)
        self.text_box.pack(fill=tk.BOTH, expand=True, pady=5)

        # Frame for options
        options_frame = tk.LabelFrame(self.root, text="Options")
        options_frame.pack(padx=10, pady=5, fill=tk.X)

        # Typing speed presets
        preset_label = tk.Label(options_frame, text="Typing Speed Preset:")
        preset_label.grid(row=0, column=0, padx=5, pady=5, sticky='w')

        preset_frame = tk.Frame(options_frame)
        preset_frame.grid(row=0, column=1, columnspan=4, padx=5, pady=5, sticky='w')

        for preset in self.presets:
            rb = tk.Radiobutton(preset_frame, text=preset, variable=self.selected_preset, value=preset, command=self.preset_selected)
            rb.pack(side=tk.LEFT, padx=5)

        # Countdown options
        countdown_label = tk.Label(options_frame, text="Countdown before typing (seconds):")
        countdown_label.grid(row=1, column=0, padx=5, pady=5, sticky='w')

        self.countdown_var = tk.IntVar(value=3)
        self.countdown_entry = tk.Entry(options_frame, textvariable=self.countdown_var, width=5)
        self.countdown_entry.grid(row=1, column=1, padx=5, pady=5, sticky='w')

        # Frame for buttons
        button_frame = tk.Frame(self.root)
        button_frame.pack(padx=10, pady=5)

        self.start_button = tk.Button(button_frame, text="Start", command=self.start_typing)
        self.start_button.pack(side=tk.LEFT, padx=5)

        self.stop_button = tk.Button(button_frame, text="Stop", command=self.stop_typing, state=tk.DISABLED)
        self.stop_button.pack(side=tk.LEFT, padx=5)

        # Status label
        self.status_label = tk.Label(self.root, text="Ready", fg="green")
        self.status_label.pack(padx=10, pady=5)

    def preset_selected(self):
        # Optionally, you can update the status or provide feedback when a preset is selected
        selected = self.selected_preset.get()
        self.update_status(f"Preset selected: {selected}", fg="blue")

    def start_typing(self):
        if self.is_typing:
            messagebox.showwarning("Warning", "Typing is already in progress.")
            return

        text = self.text_box.get("1.0", tk.END).strip()
        if not text:
            messagebox.showerror("Error", "Please enter some text to type.")
            return

        # Get typing speed based on the selected preset
        preset = self.selected_preset.get()
        min_d, max_d = self.presets.get(preset, (0.05, 0.2))  # Default to Human Paced if not found

        countdown = self.countdown_var.get()
        if countdown < 0:
            messagebox.showerror("Error", "Countdown cannot be negative.")
            return

        # Disable start button and enable stop button
        self.start_button.config(state=tk.DISABLED)
        self.stop_button.config(state=tk.NORMAL)
        self.is_typing = True
        self.status_label.config(text=f"Countdown: {countdown}", fg="blue")

        # Start the typing process in a separate thread
        self.typing_thread = threading.Thread(target=self.typing_process, args=(text, min_d, max_d, countdown))
        self.typing_thread.start()

    def typing_process(self, text, min_delay, max_delay, countdown):
        try:
            # Countdown
            for i in range(countdown, 0, -1):
                if not self.is_typing:
                    raise InterruptedError
                self.update_status(f"Typing starts in: {i} seconds")
                time.sleep(1)

            self.update_status("Typing in progress...", fg="green")

            i = 0
            while i < len(text):
                if not self.is_typing:
                    raise InterruptedError

                # Simulate long pauses
                if random.random() < 0.05:  # 5% chance to have a long pause
                    pause_duration = random.uniform(5, 10)  # Pause between 2 to 5 seconds
                    self.update_status("Thinking...", fg="purple")
                    time.sleep(pause_duration)

                # Simulate typos and backspaces
                if random.random() < 0.15 and i < len(text) - 1:  # 10% chance to make a typo
                    typo_char = random.choice('abcdefghijklmnopqrstuvwxyz')
                    pyautogui.typewrite(typo_char)
                    time.sleep(random.uniform(min_delay, max_delay))
                    pyautogui.press('backspace')
                    time.sleep(random.uniform(min_delay, max_delay))

                char = text[i]
                pyautogui.typewrite(char)
                delay = random.uniform(min_delay, max_delay)
                time.sleep(delay)

                i += 1

            self.update_status("Typing completed.", fg="green")
        except InterruptedError:
            self.update_status("Typing stopped.", fg="red")
        except Exception as e:
            self.update_status(f"Error: {str(e)}", fg="red")
        finally:
            self.is_typing = False
            self.start_button.config(state=tk.NORMAL)
            self.stop_button.config(state=tk.DISABLED)

    def stop_typing(self):
        if self.is_typing:
            self.is_typing = False
            self.update_status("Stopping...", fg="red")

    def update_status(self, message, fg="blue"):
        def update():
            self.status_label.config(text=message, fg=fg)
        self.root.after(0, update)

def main():
    root = tk.Tk()
    app = TypingEmulator(root)
    root.mainloop()

if __name__ == "__main__":
    main()
