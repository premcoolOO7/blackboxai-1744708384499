import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox
import sqlite3
import uuid
import hashlib
import json
import pyperclip
import time
import requests
from datetime import datetime
import re

class DevToolkit:
    def __init__(self, root):
        self.root = root
        self.root.title("Developer Productivity Suite")
        self.root.geometry("1200x800")
        
        self.create_database()
        self.create_ui()
        
    def create_database(self):
        self.conn = sqlite3.connect('dev_toolkit.db')
        self.c = self.conn.cursor()
        self.c.execute('''CREATE TABLE IF NOT EXISTS snippets
                         (id INTEGER PRIMARY KEY, title TEXT, code TEXT, tags TEXT, created_at TIMESTAMP)''')
        self.conn.commit()

    def create_ui(self,):
        notebook = ttk.Notebook(self.root)
        
        # Snippet Manager Tab
        snippet_frame = ttk.Frame(notebook)
        self.create_snippet_ui(snippet_frame)
        
        # API Tester Tab
        api_frame = ttk.Frame(notebook)
        self.create_api_tester_ui(api_frame)
        
        # Regex Tester Tab
        regex_frame = ttk.Frame(notebook)
        self.create_regex_tester_ui(regex_frame)
        
        # Code Utilities Tab
        utils_frame = ttk.Frame(notebook)
        self.create_utils_ui(utils_frame)
        
        notebook.add(snippet_frame, text="Code Snippets")
        notebook.add(api_frame, text="API Tester")
        notebook.add(regex_frame, text="Regex Tester")
        notebook.add(utils_frame, text="Code Utilities")
        notebook.pack(expand=1, fill="both")

    def create_snippet_ui(self, parent):
        # Snippet Management Components
        ttk.Label(parent, text="Snippet Title:").grid(row=0, column=0, padx=5, pady=5, sticky="w")
        self.title_entry = ttk.Entry(parent, width=40)
        self.title_entry.grid(row=0, column=1, padx=5, pady=5, sticky="ew")
        
        ttk.Label(parent, text="Tags (comma-separated):").grid(row=1, column=0, padx=5, pady=5, sticky="w")
        self.tags_entry = ttk.Entry(parent, width=40)
        self.tags_entry.grid(row=1, column=1, padx=5, pady=5, sticky="ew")
        
        ttk.Label(parent, text="Code:").grid(row=2, column=0, padx=5, pady=5, sticky="nw")
        self.code_editor = scrolledtext.ScrolledText(parent, width=80, height=20)
        self.code_editor.grid(row=2, column=1, columnspan=2, padx=5, pady=5, sticky="nsew")
        
        ttk.Button(parent, text="Save Snippet", command=self.save_snippet).grid(row=3, column=1, pady=10, sticky="e")
        ttk.Button(parent, text="Search Snippets", command=self.search_snippets).grid(row=3, column=2, pady=10, sticky="w")
        
        self.snippet_list = tk.Listbox(parent, width=100, height=15)
        self.snippet_list.grid(row=4, column=0, columnspan=3, padx=5, pady=5, sticky="nsew")
        self.snippet_list.bind('<<ListboxSelect>>', self.show_snippet_details)

        # Configure grid weights for resizing
        parent.grid_rowconfigure(2, weight=1)
        parent.grid_rowconfigure(4, weight=1)
        parent.grid_columnconfigure(1, weight=1)
        parent.grid_columnconfigure(2, weight=1)

    def create_api_tester_ui(self, parent):
        # API Testing Components
        ttk.Label(parent, text="URL:").grid(row=0, column=0, padx=5, pady=5, sticky="w")
        self.api_url = ttk.Entry(parent, width=80)
        self.api_url.grid(row=0, column=1, padx=5, pady=5, sticky="ew")
        
        ttk.Label(parent, text="Headers (JSON):").grid(row=1, column=0, padx=5, pady=5, sticky="nw")
        self.api_headers = scrolledtext.ScrolledText(parent, width=80, height=5)
        self.api_headers.grid(row=1, column=1, padx=5, pady=5, sticky="ew")
        
        ttk.Label(parent, text="Body (JSON):").grid(row=2, column=0, padx=5, pady=5, sticky="nw")
        self.api_body = scrolledtext.ScrolledText(parent, width=80, height=15)
        self.api_body.grid(row=2, column=1, padx=5, pady=5, sticky="ew")
        
        ttk.Button(parent, text="Send GET", command=lambda: self.send_api_request("GET")).grid(row=3, column=0, pady=10, sticky="ew")
        ttk.Button(parent, text="Send POST", command=lambda: self.send_api_request("POST")).grid(row=3, column=1, pady=10, sticky="ew")
        
        self.api_response = scrolledtext.ScrolledText(parent, width=100, height=20)
        self.api_response.grid(row=4, column=0, columnspan=2, padx=5, pady=5, sticky="nsew")

        # Configure grid weights for resizing
        parent.grid_rowconfigure(4, weight=1)
        parent.grid_columnconfigure(1, weight=1)

    def create_regex_tester_ui(self, parent):
        # Regex Testing Components
        ttk.Label(parent, text="Pattern:").grid(row=0, column=0, padx=5, pady=5, sticky="w")
        self.regex_pattern = ttk.Entry(parent, width=80)
        self.regex_pattern.grid(row=0, column=1, padx=5, pady=5, sticky="ew")
        
        ttk.Label(parent, text="Test String:").grid(row=1, column=0, padx=5, pady=5, sticky="nw")
        self.regex_test_string = scrolledtext.ScrolledText(parent, width=80, height=15)
        self.regex_test_string.grid(row=1, column=1, padx=5, pady=5, sticky="ew")
        
        ttk.Button(parent, text="Test Regex", command=self.test_regex).grid(row=2, column=1, pady=10, sticky="e")
        
        self.regex_results = scrolledtext.ScrolledText(parent, width=100, height=20)
        self.regex_results.grid(row=3, column=0, columnspan=2, padx=5, pady=5, sticky="nsew")

        # Configure grid weights for resizing
        parent.grid_rowconfigure(3, weight=1)
        parent.grid_columnconfigure(1, weight=1)

    def create_utils_ui(self, parent):
        # Code Utilities Components
        ttk.Button(parent, text="Generate UUID", command=self.generate_uuid).grid(row=0, column=0, pady=5, padx=5, sticky="ew")
        ttk.Button(parent, text="Generate Timestamp", command=self.generate_timestamp).grid(row=0, column=1, pady=5, padx=5, sticky="ew")
        ttk.Button(parent, text="Hash Generator", command=self.generate_hash).grid(row=0, column=2, pady=5, padx=5, sticky="ew")
        
        self.utils_output = scrolledtext.ScrolledText(parent, width=100, height=20)
        self.utils_output.grid(row=1, column=0, columnspan=3, padx=5, pady=5, sticky="nsew")

        # Configure grid weights for resizing
        parent.grid_rowconfigure(1, weight=1)
        parent.grid_columnconfigure(0, weight=1)
        parent.grid_columnconfigure(1, weight=1)
        parent.grid_columnconfigure(2, weight=1)

    # Database operations
    def save_snippet(self):
        title = self.title_entry.get().strip()
        code = self.code_editor.get("1.0", tk.END).strip()
        tags = self.tags_entry.get().strip()
        
        if title and code:
            self.c.execute("INSERT INTO snippets (title, code, tags, created_at) VALUES (?, ?, ?, ?)",
                          (title, code, tags, datetime.now()))
            self.conn.commit()
            messagebox.showinfo("Success", "Snippet saved successfully!")
            self.search_snippets()
        else:
            messagebox.showerror("Error", "Title and code are required!")

    def search_snippets(self):
        self.snippet_list.delete(0, tk.END)
        self.c.execute("SELECT id, title, tags FROM snippets ORDER BY created_at DESC")
        for row in self.c.fetchall():
            display_text = f"{row[0]}: {row[1]}"
            if row[2]:
                display_text += f" [{row[2]}]"
            self.snippet_list.insert(tk.END, display_text)

    def show_snippet_details(self, event):
        selection = self.snippet_list.curselection()
        if selection:
            snippet_id = self.snippet_list.get(selection[0]).split(":")[0]
            self.c.execute("SELECT title, code, tags FROM snippets WHERE id=?", (snippet_id,))
            result = self.c.fetchone()
            if result:
                self.title_entry.delete(0, tk.END)
                self.title_entry.insert(0, result[0])
                self.tags_entry.delete(0, tk.END)
                self.tags_entry.insert(0, result[2] if result[2] else "")
                self.code_editor.delete(1.0, tk.END)
                self.code_editor.insert(tk.END, result[1])

    # API Tester functions
    def send_api_request(self, method):
        url = self.api_url.get().strip()
        headers_text = self.api_headers.get("1.0", tk.END).strip()
        body_text = self.api_body.get("1.0", tk.END).strip()
        
        if not url:
            messagebox.showerror("Error", "URL is required!")
            return
        
        try:
            headers = json.loads(headers_text) if headers_text else {}
        except json.JSONDecodeError:
            messagebox.showerror("Error", "Invalid JSON format in headers")
            return
        
        try:
            body = json.loads(body_text) if body_text and method == "POST" else None
        except json.JSONDecodeError:
            messagebox.showerror("Error", "Invalid JSON format in body")
            return
        
        try:
            self.api_response.delete(1.0, tk.END)
            if method == "GET":
                response = requests.get(url, headers=headers)
            elif method == "POST":
                response = requests.post(url, headers=headers, json=body)
            else:
                messagebox.showerror("Error", f"Unsupported HTTP method: {method}")
                return
            
            self.api_response.insert(tk.END, f"Status Code: {response.status_code}\n")
            self.api_response.insert(tk.END, f"Headers:\n{response.headers}\n\n")
            try:
                json_response = response.json()
                pretty_json = json.dumps(json_response, indent=4)
                self.api_response.insert(tk.END, f"JSON Response:\n{pretty_json}")
            except ValueError:
                self.api_response.insert(tk.END, f"Response Text:\n{response.text}")
        except requests.RequestException as e:
            messagebox.showerror("Request Error", str(e))

    # Regex Tester functions
    def test_regex(self):
        pattern = self.regex_pattern.get()
        test_string = self.regex_test_string.get("1.0", tk.END)
        
        try:
            matches = re.finditer(pattern, test_string)
            self.regex_results.delete(1.0, tk.END)
            found = False
            for match in matches:
                found = True
                self.regex_results.insert(tk.END, 
                    f"Match found at {match.start()}-{match.end()}: {match.group()}\n")
            if not found:
                self.regex_results.insert(tk.END, "No matches found.\n")
        except re.error as e:
            messagebox.showerror("Error", f"Invalid regular expression: {e}")

    # Utility functions
    def generate_uuid(self):
        generated = str(uuid.uuid4())
        pyperclip.copy(generated)
        self.utils_output.delete(1.0, tk.END)
        self.utils_output.insert(tk.END, generated)

    def generate_timestamp(self):
        generated = str(int(time.time()))
        pyperclip.copy(generated)
        self.utils_output.delete(1.0, tk.END)
        self.utils_output.insert(tk.END, generated)

    def generate_hash(self):
        text = self.utils_output.get("1.0", tk.END).strip()
        if text:
            hashed = hashlib.sha256(text.encode()).hexdigest()
            self.utils_output.delete(1.0, tk.END)
            self.utils_output.insert(tk.END, hashed)
            pyperclip.copy(hashed)
        else:
            messagebox.showerror("Error", "No text to hash!")

if __name__ == "__main__":
    root = tk.Tk()
    app = DevToolkit(root)
    root.mainloop()
