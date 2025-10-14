/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useApplyToJob } from "@/api/apiApplication";
import { BarLoader } from "react-spinners";
import { useJobContext } from "@/context/JobContext";
import { useToast } from "@/context/ToastContext";

const schema = z.object({
  experience: z
    .number()
    .min(0, { message: "Experience must be at least 0" })
    .int(),
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }),
  resume: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword"),
      { message: "Only PDF or Word documents are allowed" }
    ),
});

export function ApplyJobDrawer({ user, job, fetchJob, applied = false }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });
  const { applyToJob: applyToJobContext } = useJobContext();
  const { showSuccess, showError } = useToast();

  const applyToJobMutation = useApplyToJob();
  const [loadingApply, setLoadingApply] = React.useState(false);
  const [errorApply, setErrorApply] = React.useState(null);

  const onSubmit = async (data) => {
    console.log('Submitting application for job:', job.id);
    console.log('User data:', user);
    console.log('Form data:', data);
    
    // Apply to job in context for instant UI update with full job data
    applyToJobContext(job.id, job);
    
    // Show immediate success toast for better UX
    showSuccess(
      `Successfully applied to "${job.title}" at ${job.company?.name || (typeof job.company === 'string' ? job.company : 'Company')}! Your application has been submitted and is under review.`,
      6000
    );
    
    // Submit to Convex backend
    try {
      setLoadingApply(true);
      setErrorApply(null);

      const applicationPayload = {
        socialId: user.id,
        jobId: String(job.id),
        education: data.education,
        experienceYears: String(data.experience ?? ''),
        skills: data.skills ? String(data.skills).split(',').map(s => s.trim()).filter(Boolean) : [],
      };

      // For now, we do not upload resume here; resume upload happens in profile
      const result = await applyToJobMutation(applicationPayload);
      console.log('Application submitted to Convex:', result);

      // Refresh job data to get updated application count
      fetchJob();
      reset();
    } catch (error) {
      console.error('Error applying to job via Convex:', error);
      setErrorApply({ message: error?.message || 'Failed to submit application' });
      showError(
        `Application saved locally but failed to sync with server. Please check your connection and try again.`,
        5000
      );
      fetchJob();
    } finally {
      setLoadingApply(false);
    }
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={job?.isOpen && !applied ? "blue" : "destructive"}
          disabled={!job?.isOpen || applied}
          className="w-full"
        >
          {job?.isOpen 
            ? (applied 
                ? "✓ Already Applied" 
                : "Apply Now"
              ) 
            : "Hiring Closed"
          }
        </Button>
      </DrawerTrigger>
      
      {/* Only show drawer content if not already applied */}
      {!applied && (
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              Apply for {job?.title} at {job?.company?.name}
            </DrawerTitle>
            <DrawerDescription>Please Fill the form below</DrawerDescription>
          </DrawerHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 p-4 pb-0"
          >
            <Input
              type="number"
              placeholder="Years of Experience"
              className="flex-1"
              {...register("experience", {
                valueAsNumber: true,
              })}
            />
            {errors.experience && (
              <p className="text-red-500">{errors.experience.message}</p>
            )}
            <Input
              type="text"
              placeholder="Skills (Comma Separated)"
              className="flex-1"
              {...register("skills")}
            />
            {errors.skills && (
              <p className="text-red-500">{errors.skills.message}</p>
            )}
            <Controller
              name="education"
              control={control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} {...field}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Graduate" id="graduate" />
                    <Label htmlFor="graduate">Graduate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Post Graduate" id="post-graduate" />
                    <Label htmlFor="post-graduate">Post Graduate</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.education && (
              <p className="text-red-500">{errors.education.message}</p>
            )}
            <Input
              type="file"
              accept=".pdf, .doc, .docx"
              className="flex-1 file:text-gray-500"
              {...register("resume")}
            />
            {errors.resume && (
              <p className="text-red-500">{errors.resume.message}</p>
            )}
            {errorApply?.message && (
              <p className="text-red-500">{errorApply?.message}</p>
            )}
            {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}
            <Button type="submit" variant="blue" size="lg">
              Submit Application
            </Button>
          </form>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      )}
    </Drawer>
  );
}
