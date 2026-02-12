// Глобальные типы для полифиллов
declare global {
  interface ObjectConstructor {
    hasOwn(obj: any, prop: string | symbol): boolean;
  }
}

export {};