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
  users: {},
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
  setUsers: (userList: string[]) => {
    set((prev: any) => {
      const newUsers = { ...prev.users };
      userList.forEach((userId) => {
        if (!(userId in newUsers)) {
          newUsers[userId] = useRef(null);
        }
      });
      console.log("newUsers", newUsers);
      return { users: newUsers };
    });
  },
}));
