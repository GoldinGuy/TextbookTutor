import React, { useState } from "react";
import Navbar from "../components/Navbar";
import PDFViewer from "../components/PDFViewer";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const tabs = [
  { name: 'Highlighting', href: '#', current: true },
  { name: 'Search', href: '#', current: false },
]

export default function editor() {
  function handleHighlight() {
    const selection = window.getSelection();
    if (selection?.toString()) {
      alert(`Text selected: ${selection.toString()}`);
    }
  }

  return (
    <div onMouseUp={handleHighlight} className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="py-6">
        <div className="mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8">
          <main className="col-span-7">
            <h1>hasdfjsadf</h1>
            {/* <PDFViewer pdfUrl="https://arxiv.org/pdf/1706.03762.pdf" /> */}
          </main>
          <aside className="col-span-5 xl:block">
            <div className="sticky top-6 space-y-4 p-5 bg-white rounded-md shadow-sm min-h-screen">
              <div className="hidden sm:block">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <a
                      key={tab.name}
                      href={tab.href}
                      className={classNames(
                        tab.current
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm'
                      )}
                      aria-current={tab.current ? 'page' : undefined}
                    >
                      {tab.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
