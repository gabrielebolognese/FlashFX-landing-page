export const lightweightFaqData = [
  {
    question: 'What is the minimum RAM required to run FlashFX?',
    answer: 'FlashFX requires a minimum of 2 GB of available RAM. At idle, the editor uses approximately 200 MB of browser memory, rising to around 400 MB during active editing and peaking near 800 MB during export rendering. This makes it functional on machines with as little as 2 GB total RAM, though 4 GB provides a smoother experience with other browser tabs open.',
  },
  {
    question: 'Does FlashFX work on a Chromebook?',
    answer: 'Yes. FlashFX is fully functional on Chromebooks because it runs in the Chrome browser — no Linux environment, no Android app, no additional setup required. It has been tested on Chromebooks with 4 GB RAM including the Lenovo Chromebook Duet, HP Chromebook 14, and Acer Chromebook 315. Export to MP4, WebM, and GIF all function normally.',
  },
  {
    question: 'Can I use FlashFX on an old Windows laptop from 2012–2016?',
    answer: 'Yes, provided the machine can run a modern browser (Chrome, Firefox, or Edge). FlashFX has been used successfully on Windows 7, Windows 8, and Windows 10 machines with Celeron and first-generation Core i3 processors and 4 GB RAM. The only hard requirement is a browser that supports WebGL — which covers virtually any browser released after 2013.',
  },
  {
    question: 'Why is FlashFX lighter than DaVinci Resolve and Premiere Pro?',
    answer: 'DaVinci Resolve and Adobe Premiere Pro are native desktop applications built for professional studio workstations. They include GPU-accelerated rendering pipelines, multi-camera editing, audio mixing suites, color science engines, and dozens of other systems that require significant RAM, CPU, and often GPU resources. FlashFX is purpose-built for motion graphics creation and runs optimized code in the browser. It does only what a motion graphics editor needs to do, which means it can do it on a fraction of the hardware.',
  },
  {
    question: 'Does FlashFX work without an internet connection?',
    answer: 'The FlashFX editor requires an initial internet connection to load the application. Once loaded, offline editing is possible for short periods. However, export rendering currently requires an active connection to finalize and download the output file. If you work in environments with intermittent connectivity, we recommend loading the editor before going offline and completing exports once reconnected.',
  },
  {
    question: 'Is FlashFX a good lightweight video editor for beginners?',
    answer: 'Yes. FlashFX combines low hardware requirements with a low learning curve — a combination that is rare among video editing tools. Most lightweight editors either sacrifice features or are difficult to learn. FlashFX provides a full motion graphics timeline with animation presets that allow beginners to produce professional-looking results quickly. Most first-time users complete and export their first project within 15 minutes.',
  },
];
