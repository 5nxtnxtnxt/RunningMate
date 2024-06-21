'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { fetchWithRetry } from '@utils/fetch';
import { cn } from '@/lib/utils';
import { LatLng, MyMap } from './page';

const CourseFormSchema = z.object({
  title: z.string().min(2, '2글자 이상 입력해주세요.').max(20),
  difficulty: z.coerce.number().min(0).max(2),
  distance: z.number().min(0).max(300),
  course: z
    .array(z.object({ La: z.number(), Ma: z.number() }))
    .min(2, '좌표를 두개 이상 찍어주세요.'),
});

export default function AddCourse({
  mapRef,
}: {
  mapRef: React.MutableRefObject<MyMap | undefined>;
}) {
  const [drawMode, setDrawMode] = useState(false);
  const [dots, setDots] = useState<LatLng[]>([]);
  const btnColor = ['bg-diff0', 'bg-diff1', 'bg-diff2'];
  const form = useForm<z.infer<typeof CourseFormSchema>>({
    resolver: zodResolver(CourseFormSchema),
    defaultValues: {
      title: '',
      difficulty: 1,
      distance: 0,
      course: [],
    },
  });
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.data.polyLine.setOptions({ strokeOpacity: 0.8 });
    mapRef.current.data.dotMarkers.forEach((m) => m.setVisible(true));
  }, []);
  const toggleMode = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); //안하면 자동제출됨
    if (!mapRef.current) return;
    const { data } = mapRef.current;
    data.drawMode = !data.drawMode;
    data.dotMarkers.forEach((marker) => {
      marker.K = data.drawMode;
    });
    setDrawMode(data.drawMode);
    if (drawMode) {
      setDots(data.dots);

      form.setValue(
        'course',
        data.dots.map((dots) => ({
          La: dots.Ma,
          Ma: dots.La,
        }))
      );
      form.setValue('distance', Math.round(data.polyLine.getLength() / 1000));
      form.trigger('course');
    }
  };

  const submit = async () => {
    const url = '/api/courses';
    const res = await fetchWithRetry(url, {
      method: 'POST',
      body: JSON.stringify(form.getValues()),
      headers: {
        'Content-type': 'application/json',
      },
    });
    if (!res?.ok) throw new Error('코스 등록 실패');
    location.reload();
  };
  return (
    <div className="flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)}>
          <div className="flex flex-col gap-8 p-4">
            <FormField
              control={form.control}
              name="course"
              render={() => (
                <>
                  <div className="grow">
                    {drawMode ? (
                      <Button
                        onClick={toggleMode}
                        className="w-full h-11 font-bold"
                      >
                        그리기 완료
                      </Button>
                    ) : (
                      <Button
                        onClick={toggleMode}
                        className="w-full h-11 border text-gray-600 font-bold"
                        variant="ghost"
                      >
                        수정하기
                      </Button>
                    )}
                  </div>
                  <FormItem>
                    <FormLabel htmlFor="course" className="font-bold text-base">
                      코스 정보
                    </FormLabel>
                    <FormControl>
                      {!drawMode ? (
                        <div className="flex flex-col font-medium text-sm">
                          <div className="flex ">
                            <h3 className="grow basis-0">좌표</h3>
                            <div className="flex grow gap-1 basis-0">
                              <h4 className="text-primary">{dots.length}</h4>
                              <h4>개</h4>
                            </div>
                          </div>
                          <div className="flex ">
                            <h3 className="grow basis-0">총 거리</h3>
                            <div className="flex grow gap-1 basis-0">
                              <h4 className="text-primary">
                                {(
                                  mapRef.current?.data.polyLine.getLength() /
                                  1000
                                ).toFixed(2)}
                              </h4>
                              <h4>km</h4>
                            </div>
                          </div>
                          <div className="flex">
                            <h3 className="grow basis-0">예상 소요시간</h3>
                            <div className="flex grow gap-1 basis-0">
                              <h4 className="text-primary">
                                {Math.floor(
                                  mapRef.current?.data.polyLine.getLength() /
                                    100
                                )}
                              </h4>
                              <h4>{`분 (6km/h)`}</h4>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <h1 className="text-ms font-medium">
                          [그리기 완료] 버튼을 눌러주세요.
                        </h1>
                      )}
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <div className="border-t"></div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title" className="font-bold text-base">
                    코스명
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem className="mb-10">
                  <FormLabel
                    htmlFor="difficulty"
                    className="font-bold text-base"
                  >
                    난이도
                  </FormLabel>
                  <FormControl>
                    <div className="flex">
                      {['쉬움', '보통', '어려움'].map((difStr, index) => (
                        <div
                          key={index}
                          className={`gap-2 rounded border grow h-9 flex items-center justify-center ${form.getValues('difficulty') === index ? 'font-bold border-primary border-2' : 'p-[1px]'} cursor-pointer`}
                          onClick={() => {
                            form.setValue('difficulty', index);
                            form.trigger();
                          }}
                        >
                          <div
                            className={`${btnColor[index]} size-3 rounded-full`}
                          ></div>
                          <h6 className="text-sm">{difStr}</h6>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.isValid ? (
              <Button type="submit" className="w-full font-bold">
                완료
              </Button>
            ) : (
              <div>
                <Button
                  type="submit"
                  className="w-full border text-gray-600 font-bold "
                  variant="ghost"
                >
                  완료
                </Button>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
