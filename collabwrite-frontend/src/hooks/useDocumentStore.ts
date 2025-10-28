/**
 * Store Zustand pour la gestion d'état global des documents
 * Projet Spé 4 - Gestion centralisée de l'état unifié
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DocumentStore, UserPreferences, Folder, File, UploadedFile, FileType } from '@/types/document';

// Données simulées pour les dossiers
const mockFolders: Folder[] = [
  {
    id: 'folder-1',
    name: 'Projets',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    color: '#3b82f6',
  },
  {
    id: 'folder-2',
    name: 'Notes',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    color: '#10b981',
  }
];

// Données simulées pour les fichiers (certains dans des dossiers, d'autres sans dossier)
const mockFiles: File[] = [
  // Fichiers dans le dossier "Projets"
  {
    id: 'file-1',
    name: 'Projet Alpha',
    fileType: 'txt',
    content: '<h2>Projet Alpha</h2><p>Description du projet Alpha...</p>',
    folderId: 'folder-1',
    description: 'Description du projet Alpha',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    author: 'Admin',
    tags: ['projet', 'alpha'],
    isDirty: false,
  },
  {
    id: 'file-2',
    name: 'Projet Beta',
    fileType: 'txt',
    content: '<h2>Projet Beta</h2><p>Description du projet Beta...</p>',
    folderId: 'folder-1',
    description: 'Description du projet Beta',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    author: 'Admin',
    tags: ['projet', 'beta'],
    isDirty: false,
  },
  // Fichiers dans le dossier "Notes"
  {
    id: 'file-3',
    name: 'Réunion du 20 janvier',
    fileType: 'txt',
    content: '<h2>Réunion du 20 janvier</h2><p>Points abordés...</p>',
    folderId: 'folder-2',
    description: 'Compte-rendu de réunion',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    author: 'Marie Dupont',
    tags: ['réunion', 'notes'],
    isDirty: false,
  },
  // Fichiers sans dossier (racine)
  {
    id: 'file-4',
    name: 'Guide de démarrage',
    fileType: 'txt',
    content: '<h2>Guide de démarrage</h2><p>Bienvenue dans le Projet Spé 4 !</p><p>Ce document vous aidera à comprendre les fonctionnalités principales de l\'application.</p>',
    folderId: null,
    description: 'Document d\'introduction au projet',
    author: 'Admin',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    tags: ['guide', 'démarrage'],
    isDirty: false,
  },
  {
    id: 'file-5',
    name: 'Spécifications techniques',
    fileType: 'txt',
    content: '<h2>Spécifications techniques</h2><h3>Stack technologique</h3><ul><li>React + TypeScript</li><li>TailwindCSS</li><li>shadcn/ui</li><li>Zustand</li><li>Framer Motion</li></ul>',
    folderId: null,
    description: 'Documentation technique du projet',
    author: 'Jean Martin',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    tags: ['technique', 'spécifications'],
    isDirty: false,
  },
];

const mockUploadedFiles: UploadedFile[] = [
  {
    id: 'uploaded-1',
    name: 'diagramme.png',
    type: 'image',
    size: 1024000,
    url: '/uploads/diagramme.png',
    uploadedAt: new Date('2024-01-15'),
    fileId: 'file-1',
  },
  {
    id: 'uploaded-2',
    name: 'rapport.pdf',
    type: 'pdf',
    size: 2048000,
    url: '/uploads/rapport.pdf',
    uploadedAt: new Date('2024-01-16'),
    fileId: 'file-2',
  }
];

const defaultPreferences: UserPreferences = {
  theme: 'system',
  autoSave: true,
  autoSaveInterval: 30000, // 30 secondes
  fontSize: 'medium',
  editorMode: 'wysiwyg',
};

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      // État initial
      files: mockFiles,
      folders: mockFolders,
      uploadedFiles: mockUploadedFiles,
      currentFile: null,
      currentFolder: null,
      isLoading: false,
      isSaving: false,
      lastSaved: null,
      searchQuery: '',
      selectedTags: [],
      sortBy: 'updatedAt',
      sortOrder: 'desc',
      theme: 'light',
      userPreferences: defaultPreferences,

      // Actions pour les fichiers
      createFile: async (
        name: string,
        fileType: FileType,
        folderId: string | null = null,
        content = '',
        uploadedFile?: globalThis.File
      ) => {
        let fileContent = content;
        let fileSize = 0;

        // Si c'est un fichier uploadé (png/pdf), on stocke l'URL
        if (uploadedFile) {
          fileContent = URL.createObjectURL(uploadedFile);
          fileSize = uploadedFile.size;
        }

        const newFile: File = {
          id: `file-${Date.now()}`,
          name,
          fileType,
          content: fileContent,
          folderId,
          createdAt: new Date(),
          updatedAt: new Date(),
          author: 'Utilisateur actuel',
          tags: [],
          size: fileSize,
          isDirty: false,
        };

        set((state) => ({
          files: [newFile, ...state.files],
          currentFile: newFile,
        }));

        return newFile;
      },

      updateFile: async (id: string, updates: Partial<File>) => {
        set((state) => ({
          files: state.files.map((file) =>
            file.id === id
              ? { ...file, ...updates, updatedAt: new Date(), isDirty: true }
              : file
          ),
          currentFile:
            state.currentFile?.id === id
              ? { ...state.currentFile, ...updates, updatedAt: new Date(), isDirty: true }
              : state.currentFile,
        }));
      },

      deleteFile: async (id: string) => {
        set((state) => ({
          files: state.files.filter((file) => file.id !== id),
          currentFile:
            state.currentFile?.id === id ? null : state.currentFile,
        }));
      },

      setCurrentFile: (file: File | null) => {
        set({ currentFile: file });
      },

      saveFile: async (file: File) => {
        set({ isSaving: true });

        // Simulation d'un appel API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        set((state) => ({
          files: state.files.map((f) =>
            f.id === file.id
              ? { ...file, isDirty: false }
              : f
          ),
          currentFile: file.id === state.currentFile?.id
            ? { ...file, isDirty: false }
            : state.currentFile,
          isSaving: false,
          lastSaved: new Date(),
        }));
      },

      // Actions pour les dossiers
      createFolder: async (name: string, color?: string) => {
        const newFolder: Folder = {
          id: `folder-${Date.now()}`,
          name,
          createdAt: new Date(),
          updatedAt: new Date(),
          color: color || '#3b82f6',
        };

        set((state) => ({
          folders: [newFolder, ...state.folders],
          currentFolder: newFolder,
        }));

        return newFolder;
      },

      updateFolder: async (id: string, updates: Partial<Folder>) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id
              ? { ...folder, ...updates, updatedAt: new Date() }
              : folder
          ),
          currentFolder:
            state.currentFolder?.id === id
              ? { ...state.currentFolder, ...updates, updatedAt: new Date() }
              : state.currentFolder,
        }));
      },

      deleteFolder: async (id: string) => {
        // Supprimer aussi tous les fichiers du dossier
        set((state) => ({
          files: state.files.filter((file) => file.folderId !== id),
          folders: state.folders.filter((folder) => folder.id !== id),
          currentFolder:
            state.currentFolder?.id === id ? null : state.currentFolder,
        }));
      },

      setCurrentFolder: (folder: Folder | null) => {
        set({ currentFolder: folder });
      },

      // Actions de recherche et tri
      searchFiles: (query: string) => {
        set({ searchQuery: query });
      },

      filterByTags: (tags: string[]) => {
        set({ selectedTags: tags });
      },

      sortFiles: (by: 'name' | 'createdAt' | 'updatedAt', order: 'asc' | 'desc') => {
        set({ sortBy: by, sortOrder: order });
      },

      // Actions générales
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }));
      },

      updatePreferences: (preferences: Partial<UserPreferences>) => {
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...preferences },
        }));
      },

      loadFiles: async () => {
        set({ isLoading: true });

        // Simulation d'un appel API
        await new Promise((resolve) => setTimeout(resolve, 500));

        set({ isLoading: false });
      },

      // Actions pour l'upload de fichiers (uploadedFiles pour métadonnées)
      uploadFileData: async (file: globalThis.File, fileId?: string): Promise<UploadedFile> => {
        const newFile: UploadedFile = {
          id: `uploaded-${Date.now()}`,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'pdf',
          size: file.size,
          url: URL.createObjectURL(file), // URL simulée
          uploadedAt: new Date(),
          fileId,
        };

        set((state) => ({
          uploadedFiles: [newFile, ...state.uploadedFiles],
        }));

        return newFile;
      },

      deleteUploadedFile: async (id: string) => {
        set((state) => ({
          uploadedFiles: state.uploadedFiles.filter((file) => file.id !== id),
        }));
      },

      getFilesByFileId: (fileId: string) => {
        return get().uploadedFiles.filter((file) => file.fileId === fileId);
      },
    }),
    {
      name: 'document-store',
      partialize: (state) => ({
        theme: state.theme,
        userPreferences: state.userPreferences,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
);

// Sélecteurs utiles
export const useFilteredFiles = () => {
  const { files, searchQuery, selectedTags, sortBy, sortOrder } = useDocumentStore();

  let filtered = files;

  // Filtrage par recherche
  if (searchQuery) {
    filtered = filtered.filter(
      (file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (file.description && file.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Filtrage par tags
  if (selectedTags.length > 0) {
    filtered = filtered.filter((file) =>
      selectedTags.every((tag) => file.tags.includes(tag))
    );
  }

  // Tri
  filtered.sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'createdAt':
        aValue = a.createdAt.getTime();
        bValue = b.createdAt.getTime();
        break;
      case 'updatedAt':
        aValue = a.updatedAt.getTime();
        bValue = b.updatedAt.getTime();
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  return filtered;
};

// Récupérer les fichiers d'un dossier spécifique
export const useFilesByFolder = (folderId: string | null) => {
  const files = useDocumentStore((state) => state.files);
  return files.filter((file) => file.folderId === folderId);
};

// Récupérer les fichiers sans dossier (racine)
export const useRootFiles = () => {
  const files = useDocumentStore((state) => state.files);
  return files.filter((file) => file.folderId === null);
};

export const useFileStats = () => {
  const files = useDocumentStore((state) => state.files);

  return {
    total: files.length,
    dirty: files.filter((file) => file.isDirty).length,
    recent: files.filter(
      (file) => Date.now() - file.updatedAt.getTime() < 7 * 24 * 60 * 60 * 1000
    ).length,
  };
};

// Alias pour compatibilité temporaire
export const useFilteredDocuments = useFilteredFiles;
export const useDocumentStats = useFileStats;