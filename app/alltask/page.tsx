"use client";

import Image from "next/image";
import TaskBanner from "../../assets/images/task.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Footer from "@/component/footer";

type tasks = {
  id: string;
  created_at: string; // เดิมสะกด create_at -> ให้ตรงกับ select
  title: string;
  detail: string;
  image_url: string;
  is_completed: boolean;
  update_at: string;
};

export default function Page() {
  const [tasks, setTasks] = useState<tasks[]>([]); // ใช้ type เดียวกับที่ประกาศ

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("task_tb")
        .select(
          "id, created_at, title, detail, image_url, is_completed, update_at"
        )
        .order("created_at", { ascending: false });

      if (error) {
        alert("เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่");
        console.error(error.message);
        return;
      }
      if (data) {
        setTasks(data as tasks[]);
      }
    };
    fetchTasks();
  }, []);

  const handleDeletClick = async (id: string) => {
    if (confirm("คุณแน่ใจว่าจะลบหรือไม่")) {
      const { data, error } = await supabase
        .from("task_tb")
        .delete()
        .eq("id", id);

      if (error) {
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
        console.log(error.message);
        return;
      }

      alert("ลบข้อมูลเรียบร้อย");
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <Image
          className="mt-16"
          src={TaskBanner}
          alt="Task"
          width={200}
          height={200}
        />
        <h1 className="mt-10 text-4xl font-bold text-blue-700">
          Manage Task App
        </h1>
        <h1 className="mt-5 text-2xl text-gray-400">บริการจัดการงานที่ทำ</h1>
        <div className="flex w-10/12 justify-end">
          <Link
            className="mt-5 text-white bg-sky-400 px-8 py-2 rounded hover:bg-sky-300"
            href={"/addtask"}
          >
            เพิ่มงาน
          </Link>
        </div>
        <div className="w-10/12 flex mt-5 ">
          <table className="w-full">
            <thead>
              <tr className="text-center font-bold bg-gray-300">
                <td className="border p-2">รหัส</td>
                <td className="border p-2">งานที่ต้องทำ</td>
                <td className="border p-2">รายละเอียดงาน</td>
                <td className="border p-2">สถานะ</td>
                <td className="border p-2">วันที่เพิ่ม</td>
                <td className="border p-2">วันที่แก้ไข</td>
                <td className="border p-2">Action</td>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="border p-2 text-center">
                    {task.image_url ? (
                      <Image
                        className="mx-auto"
                        src={task.image_url}
                        alt={task.title}
                        width={50}
                        height={50}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border p-2">{task.title}</td>
                  <td className="border p-2">{task.detail}</td>
                  <td className="border p-2">
                    {task.is_completed === true ? "สำเร็จ" : "ไม่สำเร็จ"}
                  </td>
                  <td className="border p-2">
                    {new Date(task.created_at).toLocaleTimeString()}
                  </td>
                  <td className="border p-2">
                    {new Date(task.update_at).toLocaleTimeString()}
                  </td>
                  <td className="border p-2">
                    <Link
                      className="text-green-500 mr-5 hover:bg-green-600"
                      href={""}
                    >
                      แก้ไข
                    </Link>
                    <button
                      onClick={() => handleDeletClick(task.id)}
                      className="text-red-500 cursor-pointer hover:bg-red-600"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
}
