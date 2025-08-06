export interface Worker {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorker {
  name: string;
  email: string;
  phoneNumber: string;
}