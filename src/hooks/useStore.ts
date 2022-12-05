import create from "zustand";
import { nanoid } from "nanoid";
import { useRef } from "react";

const getLocalStorage = (key: string) =>
  JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorage = (key: string, value: string) =>
  window.localStorage.setItem(key, JSON.stringify(value));

export const useStore = create((set) => ({
  personView: "firstPersonView",
  room: "default",
  roomList: [],
  userList: [],
  texture: "dirt",
  cubes: getLocalStorage("cubes") || [],
  addCube: (x: number, y: number, z: number) => {
    set((prev: any) => ({
      cubes: [
        ...prev.cubes,
        {
          key: nanoid(),
          pos: [x, y, z],
          texture: prev.texture,
        },
      ],
    }));
  },
  removeCube: (x: number, y: number, z: number) => {
    set((prev: any) => ({
      cubes: prev.cubes.filter((cube: any) => {
        const [X, Y, Z] = cube.pos;
        return X !== x || Y !== y || Z !== z;
      }),
    }));
  },
  setTexture: (texture: any) => {
    set(() => ({
      texture,
    }));
  },
  saveWorld: () => {
    set((prev: any) => {
      setLocalStorage("cubes", prev.cubes);
    });
  },
  resetWorld: () => {
    set(() => ({
      cubes: [],
    }));
  },
  changeCameraView: () => {
    set((prev: any) => {
      return {
        personView:
          prev.personView === "firstPersonView"
            ? "thirdPersonView"
            : "firstPersonView",
      };
    });
  },
  setRoom: (room: string) => {
    set(() => {
      return { room };
    });
  },
  setRoomList: (roomList: string[]) => {
    set(() => {
      return { roomList };
    });
  },
  setUserList: (userList: string[]) => {
    set(() => {
      return { userList };
    });
  },
  addUserList: (userId: string) => {
    set((prev: any) => {
      return { userList: [...prev.userList, userId] };
    });
  },
  setDisconnectUserList: (userId: string) => {
    set((prev: any) => {
      return { userList: prev.userList.filter((v: string) => v !== userId) };
    });
  },
  clearUserList: () => {
    set(() => ({ userList: [] }));
  },
}));
