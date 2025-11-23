import api from '@/lib/api';
import {
  EvaluateResponse,
  TestFileRequest,
  TestRequest,
  TestResponse,
  testRequestDto,
  testResponseDto,
  evaluateResponseDto
} from '@/features/opencv/schemas/opencv.schemas';


/**
 * Service layer for communicating with the NestJS OpencvController endpoints.
 */
export const opencvApi = {
  /** POST /api/v1/opencv/opencv/test */
  test: async (data: TestRequest): Promise<TestResponse> => {
    const res = await api.post('/api/v1/opencv/opencv/test', data);
    console.log('testResponseDto : ', res);
    return testResponseDto.parse(res.data);
  },

  /** POST /api/v1/opencv/opencv/test_opencv */
  testOpencv: async (data: TestRequest): Promise<TestResponse> => {
    const res = await api.post('/api/v1/opencv/opencv/test_opencv', data);
    console.log('testResponseDto : ', res);
    return testResponseDto.parse(res.data);
  },

  /** POST /api/v1/opencv/upload */
  evaluate: async (formData: FormData) => {
    const res = await api.post('/api/v1/opencv/evaluate', formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("response from server: ", res);
    return evaluateResponseDto.parse(res.data);
  },
};
