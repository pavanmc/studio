export const MODAL_CONTENT = {
  about: {
    title: "About LinguaLens",
    content: `
      <p>LinguaLens is a user-friendly application designed to provide quick and accurate text translations between various languages, enhanced with voice support. Our mission is to break down language barriers and facilitate communication across cultures.</p>
      <p>Built with modern web technologies including Next.js, Tailwind CSS, and cutting-edge AI, LinguaLens offers a responsive interface that works seamlessly on desktops, tablets, and mobile devices. We strive for an intuitive user experience and are continuously working to improve our translation quality and features.</p>
      <h3 class="text-lg font-semibold mt-4 mb-2">Voice Features</h3>
      <p>LinguaLens includes voice recognition for input and text-to-speech for output, making it more accessible and convenient for users who prefer speaking over typing or wish to hear pronunciations.</p>
      <h3 class="text-lg font-semibold mt-4 mb-2">Our Vision</h3>
      <p>To be a leading tool for instant, accessible, and reliable translations for everyday use, supporting both text and voice interactions.</p>
    `,
  },
  features: {
    title: "Key Features",
    content: `
      <ul class="list-disc list-inside space-y-2">
        <li><strong>AI-Powered Translation:</strong> Accurate translations leveraging advanced AI models.</li>
        <li><strong>Multiple Languages:</strong> Support for a wide array of languages, continuously expanding.</li>
        <li><strong>Voice Input:</strong> Speak instead of type for hands-free translation (browser dependent).</li>
        <li><strong>Voice Output:</strong> Listen to translations with text-to-speech for pronunciation and auditory learning.</li>
        <li><strong>Source Text Listening:</strong> Listen to the entered source text before or after translation.</li>
        <li><strong>Language Swap:</strong> Easily switch the source and target languages with a single click.</li>
        <li><strong>Responsive Design:</strong> Enjoy a seamless experience on any device.</li>
        <li><strong>Light & Dark Mode:</strong> Choose your preferred theme for comfortable viewing.</li>
        <li><strong>Copy to Clipboard:</strong> Quickly copy the translated text.</li>
        <li><strong>Clear Input:</strong> Effortlessly clear the input text area.</li>
        <li><strong>Searchable Language Selection:</strong> Quickly find languages in dropdowns.</li>
        <li><strong>User-Friendly Interface:</strong> Clean, modern, and intuitive design.</li>
      </ul>
    `,
  },
  contact: {
    title: "Contact Us",
    content: `
      <p>We'd love to hear from you! Whether you have a question, feedback, or a suggestion, please feel free to reach out.</p>
      <p><strong>Email:</strong> <a href="mailto:support@lingualens.example.com" class="text-primary hover:underline dark:text-primary-dark">support@lingualens.example.com</a></p>
      <p class="mt-4 text-sm text-muted-foreground"><strong>Note:</strong> As this is a demonstration application, the email address above is for illustrative purposes only and is not actively monitored.</p>
    `,
  },
  privacy: {
    title: "Privacy Policy",
    content: `
      <p><strong>Last Updated: <span id="privacy-date"></span></strong></p>
      <p>LinguaLens ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your information is handled when you use our translator application.</p>
      <h3 class="text-lg font-semibold mt-4 mb-2">Information We Process</h3>
      <p>When you use LinguaLens for translation:</p>
      <ul class="list-disc list-inside space-y-1">
        <li>The text you enter for translation, along with selected source and target languages, is sent to our AI service provider (e.g., Google AI via Genkit) to perform the translation. This data is processed according to the AI service provider's privacy policies.</li>
        <li>We do not store your translation queries on our own servers after the translation is completed and returned to you.</li>
      </ul>
      <h3 class="text-lg font-semibold mt-4 mb-2">Information We Don't Collect</h3>
       <ul class="list-disc list-inside space-y-1">
        <li>We do not collect personal information such as your name or email address for the core translation service.</li>
        <li>We do not use cookies for tracking your activity across different websites.</li>
      </ul>
      <h3 class="text-lg font-semibold mt-4 mb-2">Local Storage</h3>
      <p>We use your browser's local storage solely to remember your preferred theme (light or dark mode). This information is stored only on your device and is not accessible to us.</p>
      <h3 class="text-lg font-semibold mt-4 mb-2">Voice Features</h3>
      <p>Voice recognition (speech-to-text) and text-to-speech functionalities are typically handled by your browser's built-in APIs. Audio data processed by these features is subject to your browser's privacy policies and settings. We do not transmit or store this audio data on our servers.</p>
      <h3 class="text-lg font-semibold mt-4 mb-2">Third-Party Services</h3>
      <p>This application relies on Google AI (via Genkit) for translation services. Your use of the translation feature is subject to their terms and privacy policies. We may use CDN links for fonts or UI libraries; please refer to their respective privacy policies.</p>
      <h3 class="text-lg font-semibold mt-4 mb-2">Changes to This Policy</h3>
      <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
      <script>
        document.getElementById('privacy-date').textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      </script>
    `,
  },
  licensing: {
    title: "Licensing Information",
    content: `
      <p>LinguaLens is a project built using Next.js and various open-source technologies.</p>
      <h3 class="text-lg font-semibold mt-4 mb-2">Core Framework & Libraries:</h3>
      <ul class="list-disc list-inside space-y-1">
        <li><strong>Next.js:</strong> Licensed under the MIT License.</li>
        <li><strong>React:</strong> Licensed under the MIT License.</li>
        <li><strong>Tailwind CSS:</strong> Licensed under the MIT License.</li>
        <li><strong>Shadcn/UI:</strong> Licensed under the MIT License. Components are largely based on Radix UI.</li>
        <li><strong>Lucide Icons:</strong> Licensed under the ISC License.</li>
        <li><strong>next-themes:</strong> Licensed under the MIT License.</li>
        <li><strong>Genkit:</strong> Licensed under the Apache 2.0 License.</li>
      </ul>
      <h3 class="text-lg font-semibold mt-4 mb-2">Fonts:</h3>
      <ul class="list-disc list-inside space-y-1">
         <li><strong>Geist Font (Vercel):</strong> Licensed under the SIL Open Font License 1.1.</li>
      </ul>
      <p class="mt-4">The code specific to this LinguaLens application is provided for demonstration and educational purposes. If you intend to use or adapt this code for production, please ensure compliance with all applicable licenses of third-party components and consider any further licensing implications for your specific use case.</p>
    `,
  },
};

export type ModalType = keyof typeof MODAL_CONTENT;
