import { api } from "../utils/api"

const inquiryService = {
  submit: (data) => api.post("/inquiries", data),
}

export default inquiryService


