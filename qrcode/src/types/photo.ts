export interface Photo {
  id: string;
  image_url: string;
  storage_path: string | null;
  name: string | null;
  message: string | null;
  created_at: string;
}